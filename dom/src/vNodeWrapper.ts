import { VNode, ElementVNode, elementToVNode, h } from 'mostly-dom';

export function vNodeWrapper(rootElement: HTMLElement): (vNode: VNode) => VNode {
  const rootVNode = elementToVNode(rootElement);
  const rootVNodeSelector = vNodeSelector(rootVNode);

  return function execute(vNode: VNode): VNode {
    if (rootVNodeSelector === vNodeSelector(vNode)) return vNode;

    const wrappedVNode = h(rootVNodeSelector, {}, [ vNode ]);

    wrappedVNode.element = rootElement;

    return wrappedVNode;
  };
}

function vNodeSelector(element: VNode) {
  return (element.tagName as string).toLowerCase() +
    (element.id ? `#${element.id}` : ``) +
    (element.className ? `.${element.className.split(' ').join('.')}` : ``);
}
