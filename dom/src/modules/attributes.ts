import { VNode, Module } from '../types';

const booleanAttrs = [
  'allowfullscreen', 'async', 'autofocus', 'autoplay', 'checked', 'compact', 'controls', 'declare',
  'default', 'defaultchecked', 'defaultmuted', 'defaultselected', 'defer', 'disabled', 'draggable',
  'enabled', 'formnovalidate', 'hidden', 'indeterminate', 'inert', 'ismap', 'itemscope', 'loop', 'multiple',
  'muted', 'nohref', 'noresize', 'noshade', 'novalidate', 'nowrap', 'open', 'pauseonexit', 'readonly',
  'required', 'reversed', 'scoped', 'seamless', 'selected', 'sortable', 'spellcheck', 'translate',
  'truespeed', 'typemustmatch', 'visible',
 ];

const booleanAttrsDict: any = {};

for (let i = 0, len = booleanAttrs.length; i < len; i++) {
  booleanAttrsDict[booleanAttrs[i]] = true;
}

function updateAttrs(oldVnode: VNode, vnode: VNode) {
  let key: any;
  let cur: any;
  let old: any;
  let elm = vnode.elm as HTMLElement;
  let oldAttrs = oldVnode.data && oldVnode.data.attrs || {};
  let attrs = vnode.data && vnode.data.attrs || {};

  // update modified attributes, add new attributes
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      // TODO: add support to namespaced attributes (setAttributeNS)
      if (!cur && booleanAttrsDict[key]) {
        (<HTMLElement> elm).removeAttribute(key);
      } else {
        (<HTMLElement> elm).setAttribute(key, cur);
      }
    }
  }
  //remove removed attributes
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      (<HTMLElement> elm).removeAttribute(key);
    }
  }
}

export const AttrsModule: Module = {
  update: updateAttrs,
  create: updateAttrs,
};