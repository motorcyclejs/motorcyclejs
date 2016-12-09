import { VNode, Module } from '../types';

function updateProps(oldVnode: VNode, vnode: VNode) {
  if (!oldVnode.data && !vnode.data) return;
  let key: any;
  let cur: any;
  let old: any;
  let elm: any = vnode.elm;
  let oldProps: any = oldVnode.data && oldVnode.data.props || {};
  let props: any = vnode.data && vnode.data.props || {};

  for (key in oldProps) {
    if (!props[key]) {
      delete elm[key];
    }
  }
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}

export const PropsModule: Module = {
  create: updateProps,
  update: updateProps,
};