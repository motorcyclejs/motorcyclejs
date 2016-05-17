import {just, combineArray} from 'most'

function createVTree (vNode, children) {
  return {
    sel: vNode.sel,
    data: vNode.data,
    text: vNode.text,
    elm: vNode.elm,
    key: vNode.key,
    children
  }
}

export function transposeVNode (vNode) { // eslint-disable-line complexity
  if (vNode && vNode.data && vNode.data.static) {
    return just(vNode)
  } else if (typeof vNode.observe === 'function') {
    return vNode.map(transposeVNode).switch()
  } else if (vNode !== null && typeof vNode === 'object') {
    if (!vNode.children || vNode.children.length === 0) {
      return just(vNode)
    }

    return combineArray(
      (...children) => createVTree(vNode, children),
      vNode.children.map(transposeVNode)
    )
  } else {
    throw new TypeError('transposition: Unhandled vNode type')
  }
}
