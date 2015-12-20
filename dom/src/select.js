import reduce from 'fast.js/array/reduce'
import concat from 'fast.js/array/concat'
import filter from 'fast.js/array/filter'
import map from 'fast.js/array/map'

import matchesSelector from 'snabbdom-selector'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'

import {SCOPE_PREFIX} from './utils'
import {isolateSink, isolateSource} from './isolate'
import {makeEventsSelector} from './events'

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

const elementFromVNode =
  vNode =>
    vNode.data && vNode.data.vnode ?
      vNode.data.vnode.elm :
      vNode.elm

const mapVNodeToElement =
  vNode =>
    Array.isArray(vNode) ?
      map(vNode, elementFromVNode) :
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

const sameElements =
  (prevElements, elements) => {
    if (prevElements.length !== elements.length) {
      return false
    }
    return prevElements.every(
      (element, index) => element === elements[index]
    )
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
      events: makeEventsSelector(
        filteredVNode$
        .map(mapVNodeToElement)
        .skipRepeatsWith(sameElements)
      ),
      isolateSource,
      isolateSink,
    }
  }
}

export {makeSelectorParser, sameElements}
