import hold from '@most/hold'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'
import selectorParser from 'snabbdom-selector/lib/selectorParser'

import {domSelectorParser} from './utils'
import vTreeParser from './vTreeParser'
import {isolateSink, isolateSource} from './isolate'
import {makeSelectorParser} from './select'

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

const makeDomDriver =
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

    return DomDriver
  }

export default makeDomDriver
