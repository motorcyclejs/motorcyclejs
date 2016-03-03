import {throwError} from 'most'
import hold from '@most/hold'
import {init} from 'snabbdom'
import h from 'snabbdom/h'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'
import selectorParser from 'snabbdom-selector/lib/selectorParser'

import {domSelectorParser} from './utils'
import defaultModules from './modules'
import {transposeVTree} from './transposition'
import {isolateSink, isolateSource} from './isolate'
import {makeElementSelector} from './select'
import {makeEventsSelector} from './events'

function makeVNodeWrapper(rootElement) {
  return function vNodeWrapper(vNode) {
    const {tagName: selectorTagName, id: selectorId} = selectorParser(vNode.sel)
    const vNodeClassName = classNameFromVNode(vNode)
    const {data: vNodeData = {}} = vNode
    const {props: vNodeDataProps = {}} = vNodeData
    const {id: vNodeId = selectorId} = vNodeDataProps

    const isVNodeAndRootElementIdentical =
      vNodeId.toUpperCase() === rootElement.id.toUpperCase() &&
      selectorTagName.toUpperCase() === rootElement.tagName.toUpperCase() &&
      vNodeClassName.toUpperCase() === rootElement.className.toUpperCase()

    if (isVNodeAndRootElementIdentical) {
      return vNode
    }

    const {tagName, id, className} = rootElement
    const elementId = id ? `#${id}` : ``
    const elementClassName = className ?
      `.${className.split(` `).join(`.`)}` : ``
    return h(`${tagName}${elementId}${elementClassName}`, {}, [vNode])
  }
}

function DOMDriverInputGuard(view$) {
  if (!view$ || typeof view$.observe !== `function`) {
    throw new Error(`The DOM driver function expects as input an ` +
      `Observable of virtual DOM elements`)
  }
}

function defaultOnErrorFn(msg) {
  if (console && console.error) {
    console.error(msg)
  } else {
    console.log(msg)
  }
}

const defaults = {
  modules: defaultModules,
  onError: defaultOnErrorFn,
}

function makeDOMDriver(container, {
  modules = defaultModules,
  onError = defaultOnErrorFn,
} = defaults) {
  const patch = init(modules)
  const rootElement = domSelectorParser(container)

  if (!Array.isArray(modules)) {
    throw new Error(`Optional modules option must be ` +
     `an array for snabbdom modules`)
  }

  if (typeof onError !== `function`) {
    throw new Error(`Optional onError opition must be ` +
      `a function to approriately handle your errors`)
  }

  function DOMDriver(view$) {
    DOMDriverInputGuard(view$)

    const rootElement$ = hold(
      view$
        .map(transposeVTree).switch()
        .map(makeVNodeWrapper(rootElement))
        .scan(patch, rootElement)
        .skip(1)
        .recoverWith(err => {
          onError(err)
          return throwError(err)
        })
        .map(({elm}) => elm)
    )

    rootElement$.drain()

    return {
      observable: rootElement$,
      namespace: [],
      select: makeElementSelector(rootElement$),
      events: makeEventsSelector(rootElement$),
      isolateSink,
      isolateSource,
    }
  }

  return DOMDriver
}

export {makeDOMDriver}
