import { Module, SnabbdomAPI, VNode, VNodeData } from '../types';
import { MotorcycleVNode } from './MotorcycleVNode';
import is from './is';
import domApi from './htmldomapi';
import { isDef, isUndef, sameVNode, createKeyToOldIdx, emptyNodeAt } from './util';

const hooks: string[] = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];

const emptyVnode = new MotorcycleVNode(void 0, void 0, void 0, {}, [], void 0, void 0, void 0);

export function init(
  modules: Module[],
  api?: SnabbdomAPI<any, any, any>): (previous: VNode | HTMLElement, current: VNode) => VNode
{
  let i: number;
  let j: number;
  let cbs: any = {};

  if (isUndef(api)) api = domApi;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook: any = (modules[j] as any)[hooks[i]];
      if (isDef(hook)) cbs[hooks[i]].push(hook.bind(modules[j]));
    }
  }

  function createRmCb(childElm: Element, listeners: number) {
    return function () {
      if (--listeners === 0) {
        const parent = (api as SnabbdomAPI<Element, Text, Node>).parentNode(childElm) as Element;
        (api as SnabbdomAPI<Element, Text, Node>).removeChild(parent, childElm);
      }
    };
  }

  function createElm(vnode: VNode, insertedVnodeQueue: VNode[]) {
    let i: any;
    let data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = (data as VNodeData).hook) && isDef(i = i.init)) {
        i(vnode);
        data = vnode.data;
      }
    }
    let elm: Element | Text;
    let children = vnode.children;
    let tagName = vnode.tagName;

    if (isDef(tagName)) {
      elm = vnode.elm = isDef(data) && isDef(i = (data as VNodeData).ns)
        ? (api as SnabbdomAPI<Element, Text, Node>).createElementNS(i, tagName as string) as HTMLElement
        : (api as SnabbdomAPI<Element, Text, Node>).createElement(tagName as string) as HTMLElement;

      if (vnode.id) elm.id = vnode.id;
      if (vnode.className) elm.className = vnode.className;

      if (is.array(children)) {
        for (i = 0; i < children.length; ++i) {
          (api as SnabbdomAPI<Element, Text, Node>).appendChild(elm, createElm(children[i] as VNode, insertedVnodeQueue) as Element | Text);
        }
      } else if (is.primitive(vnode.text)) {
        (api as SnabbdomAPI<Element, Text, Node>).appendChild(elm, (api as SnabbdomAPI<Element, Text, Node>).createTextNode(vnode.text as string));
      }
      for (i = 0; i < cbs.create.length; ++i) cbs.create[i](emptyVnode, vnode);
      i = vnode.data && vnode.data.hook; // Reuse letiable
      if (isDef(i)) {
        if (i.create) i.create(emptyVnode, vnode);
        if (i.insert) insertedVnodeQueue.push(vnode);
      }
    } else {
      elm = vnode.elm = (api as SnabbdomAPI<Element, Text, Node>).createTextNode(vnode.text as string);
    }
    return vnode.elm;
  }

  function addVnodes(
    parentElm: Element,
    before: Element | Text | null,
    vnodes: VNode[],
    startIdx: number,
    endIdx: number,
    insertedVnodeQueue: VNode[],
  ) {
    for (; startIdx <= endIdx; ++startIdx) {
      (api as SnabbdomAPI<Element, Text, Node>).insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue) as Element, before as Element);
    }
  }

  function invokeDestroyHook(vnode: VNode) {
    let i: any;
    let j: number;
    let data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = (data as VNodeData).hook) && isDef(i = i.destroy)) i(vnode);
      for (i = 0; i < cbs.destroy.length; ++i) cbs.destroy[i](vnode);
      if (isDef(i = vnode.children)) {
        for (j = 0; j < (vnode.children as VNode[]).length; ++j) {
          invokeDestroyHook((vnode.children as VNode[])[j] as VNode);
        }
      }
    }
  }

  function removeVnodes(parentElm: Element, vnodes: VNode[], startIdx: number, endIdx: number) {
    for (; startIdx <= endIdx; ++startIdx) {
      let i: any;
      let listeners: number;
      let rm: () => void;
      let ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tagName)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm as Element, listeners);
          for (i = 0; i < cbs.remove.length; ++i) cbs.remove[i](ch, rm);
          if (isDef(i = ch.data) && isDef(i = i.hook) && isDef(i = i.remove)) {
            i(ch, rm);
          } else {
            rm();
          }
        } else { // Text node
          (api as SnabbdomAPI<Element, Text, Node>).removeChild(parentElm, ch.elm as HTMLElement);
        }
      }
    }
  }

  function updateChildren(parentElm: Element, oldCh: Array<VNode | undefined>, newCh: VNode[], insertedVnodeQueue: VNode[]) {
    let oldStartIdx = 0, newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx: string | number | undefined = undefined;
    let idxInOld: number;
    let elmToMove: VNode | undefined;
    let before: Element | null;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVNode(oldStartVnode as VNode, newStartVnode)) {
        patchVnode(oldStartVnode as VNode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVNode(oldEndVnode as VNode, newEndVnode)) {
        patchVnode(oldEndVnode as VNode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVNode(oldStartVnode as VNode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode as VNode, newEndVnode, insertedVnodeQueue);
        (api as SnabbdomAPI<Element, Text, Node>).insertBefore(
          parentElm,
          (oldStartVnode as VNode).elm as Element,
          (api as SnabbdomAPI<Element, Text, Node>).nextSibling((oldEndVnode as VNode).elm as Element | Text) as Element,
        );
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVNode(oldEndVnode as VNode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode as VNode, newStartVnode, insertedVnodeQueue);
        (api as SnabbdomAPI<Element, Text, Node>).insertBefore(
          parentElm,
          (oldEndVnode as VNode).elm as Element,
          (oldStartVnode as VNode).elm as Element,
        );
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh as VNode[], oldStartIdx, oldEndIdx);
        idxInOld = (oldKeyToIdx as any)[(newStartVnode.key as number)] as number;
        if (isUndef(idxInOld)) { // New element
          (api as SnabbdomAPI<Element, Text, Node>).insertBefore(
            parentElm,
            createElm(newStartVnode, insertedVnodeQueue),
            (oldStartVnode as VNode).elm as Element,
          );

          newStartVnode = newCh[++newStartIdx];
        } else {
          elmToMove = oldCh[idxInOld];
          patchVnode(elmToMove as VNode, newStartVnode, insertedVnodeQueue);
          oldCh[idxInOld] = void 0;
          const newNode = (elmToMove as any).elm;
          const referenceNode = (oldStartVnode as any).elm;
          if (newNode !== referenceNode)
            (api as SnabbdomAPI<Element, Text, Node>).insertBefore(
              parentElm,
              (elmToMove as VNode).elm as Element,
              (oldStartVnode as VNode).elm as Element,
            );
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
    if (oldStartIdx > oldEndIdx) {
      before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm as Element;
      addVnodes(parentElm, before as Element, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh as VNode[], oldStartIdx, oldEndIdx);
    }
  }

  function patchVnode(oldVnode: VNode, vnode: VNode, insertedVnodeQueue: VNode[]) {
    let i: any;
    let hook: any;
    if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
      i(oldVnode, vnode);
    }
    let elm = vnode.elm = oldVnode.elm, oldCh = oldVnode.children, ch = vnode.children;

    if (vnode.id)
      elm.id = vnode.id;

    if (vnode.className)
      elm.className = vnode.className;

    if (oldVnode === vnode) return;
    if (!sameVNode(oldVnode, vnode)) {
      let parentElm = (api as SnabbdomAPI<Element, Text, Node>).parentNode(oldVnode.elm as Element);
      elm = createElm(vnode, insertedVnodeQueue) as HTMLElement;
      (api as SnabbdomAPI<Element, Text, Node>).insertBefore(parentElm, elm, oldVnode.elm as Element);
      removeVnodes(parentElm as Element, [oldVnode], 0, 0);
      return;
    }
    if (isDef(vnode.data)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode);
      i = (vnode.data as VNodeData).hook;
      if (isDef(i) && isDef(i = i.update)) i(oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm as Element, oldCh as VNode[], ch as VNode[], insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) (api as SnabbdomAPI<Element, Text, Node>).setTextContent(elm as Element, '');
        addVnodes(elm as Element, null, ch as VNode[], 0, (ch as VNode[]).length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm as Element, oldCh as VNode[], 0, (oldCh as VNode[]).length - 1);
      } else if (isDef(oldVnode.text)) {
        (api as SnabbdomAPI<Element, Text, Node>).setTextContent(elm as Element, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      (api as SnabbdomAPI<Element, Text, Node>).setTextContent(elm as Element, vnode.text as string);
    }
    if (isDef(hook) && isDef(i = hook.postpatch)) {
      i(oldVnode, vnode);
    }
  }

  return function patch(oldVNode: VNode | HTMLElement, vNode: VNode): VNode {
    let elm: Element;
    let parent: Element | Text;
    let insertedVnodeQueue: VNode[] = [];
    for (i = 0; i < cbs.pre.length; ++i) cbs.pre[i]();

    if (isUndef((oldVNode as VNode).elm)) {
      oldVNode = emptyNodeAt(oldVNode as HTMLElement);
    }

    if (sameVNode(oldVNode as VNode, vNode)) {
      patchVnode(oldVNode as VNode, vNode, insertedVnodeQueue);
    } else {
      elm = (oldVNode as VNode).elm as Element;
      parent = (api as SnabbdomAPI<Element, Text, Node>).parentNode(elm);

      createElm(vNode, insertedVnodeQueue);

      if (parent !== null) {
        (api as SnabbdomAPI<Element, Text, Node>).insertBefore(
          parent,
          vNode.elm as Element,
          (api as SnabbdomAPI<Element, Text, Node>).nextSibling(elm) as Element,
        );
        removeVnodes(parent as Element, [oldVNode as VNode], 0, 0);
      }
    }

    for (let i = 0; i < insertedVnodeQueue.length; ++i) {
      (insertedVnodeQueue[i] as any).data.hook.insert(insertedVnodeQueue[i]);
    }
    for (let i = 0; i < cbs.post.length; ++i) cbs.post[i]();
    return vNode;
  };
}