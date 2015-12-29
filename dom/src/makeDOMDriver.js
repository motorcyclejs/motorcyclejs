import {create} from 'most'
import hold from '@most/hold'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'
import selectorParser from 'snabbdom-selector/lib/selectorParser'

import {domSelectorParser} from './utils'
import vTreeParser from './vTreeParser'
import {isolateSink, isolateSource} from './isolate'
import makeElementSelector from './select'

function makeVNodeWrapper(rootElement) {
  return function vNodeWrapper(vNode) {
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

    const DomDriver =
      view$ => {
        domDriverInputGuard(view$)

        const rootElement$ = hold(create(add => {
          view$
            .map(vTreeParser)
            .switch()
            .map(makeVNodeWrapper(rootElement))
            .reduce((prev, curr) => {
              const vNode = patch(prev, curr)
              add(vNode.elm)
              return vNode
            }, rootElement)
        }))

        rootElement$.drain()

        return {
          namespace: [],
          select: makeElementSelector(rootElement$),
          isolateSink,
          isolateSource,
        }
      }

    return DomDriver
  }

export default makeDOMDriver
