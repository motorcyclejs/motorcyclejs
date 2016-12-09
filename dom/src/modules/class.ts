import { VNode, Module } from '../types';

function updateClass(oldVnode: VNode, vnode: VNode) {
  let cur: any;
  let name: string;
  let elm = vnode.elm as HTMLElement;
  let oldClass = oldVnode.data && oldVnode.data.class || {};
  let klass = vnode.data && vnode.data.class || {};

  for (name in oldClass) {
    if (!klass[name]) {
      (<HTMLElement>elm).classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      if (cur) {
        elm.classList.add(name);
      } else {
        elm.classList.remove(name);
      }
    }
  }
}

export const ClassModule: Module = {
  create: updateClass,
  update: updateClass,
};
