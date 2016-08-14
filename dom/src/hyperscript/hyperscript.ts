import { Stream } from 'most'
import { VNode, VNodeData } from '../interfaces'

function isStream(x: any): boolean {
  return x instanceof Stream
}

function mutateStreamWithNS(vNode: VNode): void {
  addNS(vNode.data as VNodeData, vNode.children as Array<VNode | string>, vNode.sel as string)
}

function addNS(data: VNodeData, children: Array<VNode | string | Stream<VNode> | null>, selector: string): void {
  data.ns = `http://www.w3.org/2000/svg`;
  if (selector !== `foreignObject` && typeof children !== `undefined` && Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      if (isStream(children[i])) {
        children[i] = (<Stream<VNode>> children[i]).tap(mutateStreamWithNS);
      } else {
        addNS((children[i] as VNode).data as VNodeData,
              (children[i] as VNode).children as Array<VNode | string | Stream<VNode>>,
              (children[i] as VNode).sel as string);
      }
    }
  }
}

export interface HyperscriptFn {
  (sel: string): VNode
  (sel: string, data: VNodeData): VNode
  (sel: string, children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
  (sel: string, data: VNodeData, children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
}

export const h: HyperscriptFn = <HyperscriptFn>function (selector: string, b?: any, c?: any): VNode {
  let data: VNodeData = {}
  let children: Array<VNode | string | Stream<VNode>> | undefined
  let text: string | undefined
  let i: number

  if (arguments.length === 3) {
    data = b
    if (Array.isArray(c)) {
      children = c
    } else if (typeof c === 'string' || typeof c === 'number') {
      text = String(c)
    }
  } else if (arguments.length === 2) {
    if (Array.isArray(b)) {
      children = b
    } else if (typeof b === 'string' || typeof b === 'number') {
      text = String(b)
    } else {
      data = b
    }
  }

  if (Array.isArray(children)) {
    children = children.filter(Boolean)
    for (i = 0; i < children.length; ++i) {
      if (typeof children[i] === 'string' || typeof children[i] === 'number') {
        children[i] = MotorcycleVNode.createTextVNode(String(children[i]) as string)
      }
    }
  }

  if (selector[0] === 's' && selector[1] === 'v' && selector[2] === 'g') {
    addNS(data, children as Array<VNode | string | Stream<VNode> | null>, selector)
  }

  return MotorcycleVNode.create(selector, data, children, text, undefined, data && data.key)
}

export class MotorcycleVNode implements VNode {
  constructor(public sel: string | undefined,
              public data: VNodeData | undefined,
              public children: Array<string | VNode | Stream<VNode>> | undefined,
              public text: string | undefined,
              public elm: HTMLElement | Text | undefined,
              public key: string | number | undefined) { }

  static create(sel: string,
                data: VNodeData,
                children: Array<string | VNode | Stream<VNode>> | undefined,
                text: string | undefined,
                elm: HTMLElement | Text | undefined,
                key: string | number | undefined): MotorcycleVNode {
    return new MotorcycleVNode(sel, data, children, text, elm, key)
  }

  static createTextVNode(text: string): MotorcycleVNode {
    return new MotorcycleVNode(undefined, undefined, undefined, text, undefined, undefined)
  }
}
