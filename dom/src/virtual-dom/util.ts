import { VNode } from '../types';
import { tagName } from './htmldomapi';
import { MotorcycleVNode } from './MotorcycleVNode';

export function isDef (x: any): boolean {
  return typeof x !== 'undefined';
}

export function isUndef(x: any): boolean {
  return typeof x === 'undefined';
}

export function sameVNode(vNode1: VNode, vNode2: VNode): boolean {
  return vNode1.key === vNode2.key && vNode1.tagName === vNode2.tagName;
}

export function createKeyToOldIdx(children: VNode[], beginIdx: number, endIdx: number): any {
  let map: any = {};
  let key: string | number;
  for (let i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key as string | number;
    if (isDef(key)) map[key] = i;
  }
  return map;
}

export function emptyNodeAt(elm: HTMLElement): VNode {
  return new MotorcycleVNode(
    tagName(elm).toLowerCase(),
    elm.className,
    elm.id,
    {},
    elm.children ? Array.prototype.slice.call(elm.childNodes).map(emptyNodeAt) : [],
    elm.textContent || void 0,
    elm,
    undefined,
  );
}
