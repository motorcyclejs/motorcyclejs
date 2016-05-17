import {h} from './hyperscript/h'
import classNameFromVNode from 'snabbdom-selector/lib/classNameFromVNode'
import selectorParser from 'snabbdom-selector/lib/selectorParser'

export class VNodeWrapper {
  constructor (rootElement) {
    this.rootElement = rootElement
  }

  call (vnode) { // eslint-disable-line complexity
    const {tagName: selectorTagName, id: selectorId} = selectorParser(vnode.sel)
    const vNodeClassName = classNameFromVNode(vnode)
    const vNodeData = vnode.data || {}
    const vNodeDataProps = vNodeData.props || {}
    const {id: vNodeId = selectorId} = vNodeDataProps

    const isVNodeAndRootElementIdentical =
      vNodeId.toLowerCase() === this.rootElement.id.toLowerCase() &&
      selectorTagName.toLowerCase() === this.rootElement.tagName.toLowerCase() &&
      vNodeClassName.toLowerCase() === this.rootElement.className.toLowerCase()

    if (isVNodeAndRootElementIdentical) { return vnode }

    const {tagName, id, className} = this.rootElement

    const elementId = id
      ? `#${id}`
      : ''

    const elementClassName = className
      ? `.${className.split(' ').join('.')}`
      : ''

    return h(`${tagName}${elementId}${elementClassName}`, {}, [vnode])
  }
}
