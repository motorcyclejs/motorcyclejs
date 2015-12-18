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
import getClasses from 'snabbdom-selector/lib/getClasses'
import parseSelector from 'snabbdom-selector/lib/parseSelector'

import filter from 'fast.js/array/filter'
import reduce from 'fast.js/array/reduce'
import concat from 'fast.js/array/concat'
import fastMap from 'fast.js/array/map'

import {getDomElement} from './utils'
import fromEvent from './fromEvent'
import parseTree from './parseTree'

const SCOPE_PREFIX = `cycle-scope-`

const isolateSource =
  (_source, _scope) =>
    _source.select(`.cycle-scope-${_scope}`)

const isolateSink =
  (sink, scope) =>
    sink.map(
      vtree => {
        if (vtree.sel.indexOf(`cycle-scope-${scope}`) === -1) {
          const c = `${vtree.sel}.cycle-scope-${scope}`
          vtree.sel = c
        }
        return vtree
      }
    )

const makeIsStrictlyInRootScope =
  namespace => leaf => {
    const isClassForeign =
      className => className.indexOf(SCOPE_PREFIX) > -1 &&
        namespace.indexOf(`.${className}`) === -1
    const isClassDomestic =
      className => className.indexOf(SCOPE_PREFIX) > -1 &&
        namespace.indexOf(`.${className}`) > -1

    for (let el = leaf; el !== void 0; el = el.parent) {
      const classNames = getClasses(el).split(` `)
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
    (eventName, useCapture = false) => {
      if (typeof eventName !== `string`) {
        throw new Error(`DOM drivers events() expects argument to be a ` +
          `string representing the event type to listen for.`)
      }
      return element$
        .map(elements => {
          if (!elements) {
            return most.empty()
          }
          return fromEvent(eventName, elements, useCapture)
        }).switch().multicast()
    }

const getElement = vnode => vnode.data && vnode.data.vnode ?
  vnode.data.vnode.elm : vnode.elm

const mapToElement = element => Array.isArray(element) ?
   fastMap(element, getElement) :
   getElement(element)

function makeFindBySelector(selector, namespace) {
  return function findBySelector(rootElem) {
    const matches = Array.isArray(rootElem) ?
      reduce(rootElem, (m, el) =>
        concat(matchesSelector(selector, el), m),
      []) : matchesSelector(selector, rootElem)
    return filter(matches, makeIsStrictlyInRootScope(namespace))
  }
}

// Use function not 'const = x => {}' for this.namespace below
function makeElementSelector(rootElem$) {
  return function DOMSelect(selector) {
    if (typeof selector !== `string`) {
      throw new Error(`DOM drivers select() expects first argument to be a ` +
        `string as a CSS selector`)
    }
    const namespace = this.namespace
    const scopedSelector = `${namespace.join(` `)} ${selector}`.trim()
    const element$ =
      selector.trim() === `:root` ?
        rootElem$ :
        rootElem$.map(
          makeFindBySelector(scopedSelector, namespace.concat(selector))
        )
    return {
      observable: element$.map(mapToElement),
      namespace: namespace.concat(selector),
      select: makeElementSelector(element$),
      events: makeEventsSelector(element$.map(mapToElement)),
      isolateSource,
      isolateSink,
    }
  }
}

function wrapVnode(vnode, rootElem) {
  const {tagName: selTagName, id: selId} = parseSelector(vnode.sel)
  const classNames = getClasses(vnode)
  const vnodeId = vnode.data && vnode.data.props && vnode.data.props.id ?
    vnode.data.props.id : selId

  const sameId = vnodeId === rootElem.id
  const sameTagName = selTagName === rootElem.tagName
  const sameClassList = classNames === rootElem.className

  if (sameId && sameTagName && sameClassList) {
    return vnode
  }
  const {tagName, id, className} = rootElem
  let sel = tagName
  sel += id ? `#${id}` : ``
  sel += className ? `.${className.split(` `).join(`.`)}` : ``
  return h(sel, {}, [vnode])
}

const validateDOMDriverInput =
  view$ => {
    if (!view$ || typeof view$.observe !== `function`) {
      throw new Error(`The DOM driver function expects as input an ` +
        `Observable of virtual DOM elements`)
    }
  }

const makeDOMDriver =
  (container, modules = [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
    require(`snabbdom/modules/style`),
  ]) => {
    const patch = snabbdom.init(modules)
    const rootElem = getDomElement(container)

    const DOMDriver =
      view$ => {
        validateDOMDriverInput(view$)

        const rootElem$ =
          view$
            .map(parseTree)
            .switch()
            .scan(
              (oldVnode, vnode) => patch(oldVnode, wrapVnode(vnode, rootElem)),
              rootElem
            )
            .skip(1)

        return {
          namespace: [],
          select: makeElementSelector(hold(rootElem$)),
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
