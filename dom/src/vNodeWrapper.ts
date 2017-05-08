import { ElementVirtualNode, VirtualNode, elementToVNode, h } from 'mostly-dom'

export function vNodeWrapper<T extends Element>(rootElement: T) {
  const rootVNode = elementToVNode(rootElement)
  const rootVNodeSelector = vNodeSelector(rootVNode)

  return function execute(vNode: VirtualNode<any>): VirtualNode<T> {
    if (rootVNodeSelector === vNodeSelector(vNode)) return vNode as VirtualNode<T>

    const wrappedVNode = h(rootVNodeSelector, {}, [ vNode ])

    wrappedVNode.element = rootElement

    return wrappedVNode as VirtualNode<T>
  }
}

function vNodeSelector<T extends Element>(element: VirtualNode<T>): string {
  return (element.tagName as string).toLowerCase() +
    (element.id ? `#${element.id}` : ``) +
    (element.className ? `.${element.className.split(' ').join('.')}` : ``)
}
