import { VNode, VNodeData } from './interfaces'
import { Stream, just, combineArray } from 'most'
import { MotorcycleVNode } from './hyperscript/hyperscript'

function createVTree (vnode: VNode, children: Array<any>): VNode {
  return MotorcycleVNode.create(vnode.sel as string,
                                vnode.data as VNodeData,
                                children,
                                vnode.text as string,
                                vnode.elm as HTMLElement,
                                vnode.key as string)
}

const notAStream: Stream<VNode> | any = {}

export function transposeVNode (vnode: VNode): Stream<VNode> {
  if (!vnode) {
    return notAStream
  } else if (vnode && typeof vnode.data === `object` && (vnode.data as any).static) {
    return just(vnode);
  } else if (vnode instanceof Stream) {
    return (vnode as Stream<VNode>).map(transposeVNode).switch()
  } else if (typeof vnode === `object`) {
    if (!vnode.children || vnode.children.length === 0) {
      return just(vnode)
    }

    const vnodeChildren: Array<Stream<VNode>> = vnode.children
      .map(transposeVNode)
      .filter((x: any) => x !== notAStream)

    if (vnodeChildren.length === 0) {
      return just(createVTree(vnode, []))
    } else {
      return combineArray<VNode, VNode, VNode>(
        (...children: VNode[]) => createVTree(vnode, children.slice()),
        vnodeChildren as [Stream<VNode>, Stream<VNode>]
      )
    }
  } else {
    throw new Error(`Unhandled vTree Value`)
  }
}
