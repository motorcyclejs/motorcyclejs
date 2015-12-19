import most from 'most'
import hold from '@most/hold'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import thunk from 'snabbdom/thunk'
const {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video,
} = require(`hyperscript-helpers`)(h)

import matchesSelector from 'snabbdom-selector'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'
import selectorParser from 'snabbdom-selector/lib/selectorParser'

import filter from 'fast.js/array/filter'
import reduce from 'fast.js/array/reduce'
import concat from 'fast.js/array/concat'
import fastMap from 'fast.js/array/map'

import {domSelectorParser} from './utils'
import fromEvent from './fromEvent'
import vTreeParser from './vTreeParser'

const SCOPE_PREFIX = `cycle-scope-`

const isolateSource =
  (source_, scope) =>
    source_.select(`.${SCOPE_PREFIX}${scope}`)

const isolateSink =
  (sink, scope) =>
    sink.map(
      vTree => {
        if (vTree.sel.indexOf(`${SCOPE_PREFIX}${scope}`) === -1) {
          vTree.sel = `${vTree.sel}.${SCOPE_PREFIX}${scope}`
        }
        return vTree
      }
    )

const makeIsVNodeStrictlyInRootScope =
  namespace => leaf => {
    const isClassForeign =
      className =>
        className.indexOf(SCOPE_PREFIX) > -1 &&
        namespace.indexOf(`.${className}`) === -1

    const isClassDomestic =
      className =>
        className.indexOf(SCOPE_PREFIX) > -1 &&
        namespace.indexOf(`.${className}`) > -1

    let vNode = leaf
    for (; vNode; vNode = vNode.parent) {
      const classNames = classNameFromVNode(vNode).split(` `)
      if (classNames.some(isClassDomestic)) {
        return true
      }
      if (classNames.some(isClassForeign)) {
        return false
      }
    }
    return true
  }

const makeEventsSelector =
  element$ =>
    (type, useCapture = false) => {
      if (typeof type !== `string`) {
        throw new Error(`DOM drivers events() expects argument to be a ` +
          `string representing the event type to listen for.`)
      }
      return element$
        .map(
          elements =>
            elements ?
              fromEvent(type, elements, useCapture) :
              most.empty()
        )
        .switch()
        .multicast()
    }

const elementFromVNode =
  vNode =>
    vNode.data && vNode.data.vnode ?
      vNode.data.vnode.elm :
      vNode.elm

const mapVNodeToElement =
  vNode =>
    Array.isArray(vNode) ?
      fastMap(vNode, elementFromVNode) :
      elementFromVNode(vNode)

function makeVNodesSelectorFilter(selectors, namespace) {
  return vNode => {
    const matches = Array.isArray(vNode) ?
      reduce(vNode, (accumulator, kValue) =>
        concat(matchesSelector(selectors, kValue), accumulator),
      []) :
      matchesSelector(selectors, vNode)
    return filter(matches, makeIsVNodeStrictlyInRootScope(namespace))
  }
}

function makeSelectorParser(vNode$) {
  // We use a regular `function` instead of a lambda function
  // because we need to have access to `this.namespace`.
  return function selectorParser_(selectors) {
    if (typeof selectors !== `string`) {
      throw new Error(`DOM drivers select() expects first argument to be a ` +
        `string containing one or more CSS selectors.`)
    }
    const namespace = this.namespace
    const scopedSelectors = `${namespace.join(` `)} ${selectors}`.trim()
    const filteredVNode$ =
      selectors.trim() === `:root` ?
        vNode$ :
        vNode$.map(
          makeVNodesSelectorFilter(
            scopedSelectors, namespace.concat(selectors)
          )
        )
    return {
      observable: filteredVNode$.map(mapVNodeToElement),
      namespace: namespace.concat(selectors),
      select: makeSelectorParser(filteredVNode$),
      events: makeEventsSelector(filteredVNode$.map(mapVNodeToElement)),
      isolateSource,
      isolateSink,
    }
  }
}

function vNodeWrapper(vNode, rootElement) {
  const {tagName: selectorTagName, id: selectorId} = selectorParser(vNode.sel)
  const vNodeClassName = classNameFromVNode(vNode)
  const {data: vNodeData = {}} = vNode
  const {props: vNodeDataProps = {}} = vNodeData
  const {id: vNodeId = selectorId} = vNodeDataProps

  const isVNodeAndRootElementIdentical =
    vNodeId === rootElement.id &&
    selectorTagName === rootElement.tagName &&
    vNodeClassName === rootElement.className

  if (isVNodeAndRootElementIdentical) {
    return vNode
  }

  const {tagName, id, className} = rootElement
  const elementId = id ? `#${id}` : ``
  const elementClassName = className ?
    `.${className.split(` `).join(`.`)}` :
    ``
  return h(`${tagName}${elementId}${elementClassName}`, {}, [vNode])
}

const domDriverInputGuard =
  view$ => {
    if (!view$ || typeof view$.observe !== `function`) {
      throw new Error(`The DOM driver function expects as input an ` +
        `Observable of virtual DOM elements`)
    }
  }

const makeDOMDriver =
  (containerElementSelectors, modules = [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
    require(`snabbdom/modules/style`),
  ]) => {
    const patch = snabbdom.init(modules)
    const rootElement = domSelectorParser(containerElementSelectors)

    const DOMDriver =
      view$ => {
        domDriverInputGuard(view$)

        const rootVNode$ =
          view$
            .map(vTreeParser)
            .switch()
            .scan(
              (prevVNode, vNode) =>
                patch(prevVNode, vNodeWrapper(vNode, rootElement)),
              rootElement
            )
            .skip(1)

        return {
          namespace: [],
          select: makeSelectorParser(hold(rootVNode$)),
          isolateSink,
          isolateSource,
        }
      }

    return DOMDriver
  }

export {
  makeDOMDriver,
  h, thunk,
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video,
}
