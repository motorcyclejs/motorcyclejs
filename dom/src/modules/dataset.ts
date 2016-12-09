import { VNode, Module } from '../types';

function updateDataset(oldVnode: VNode, vnode: VNode) {
  let elm = vnode.elm as HTMLElement;
  let oldDataset = oldVnode.data && oldVnode.data.dataset || {};
  let dataset = vnode.data && vnode.data.dataset || {};
  let key: any;

  for (key in oldDataset) {
    if (!dataset[key]) {
      delete elm.dataset[key];
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      elm.dataset[key] = dataset[key];
    }
  }
}

export const DatasetModule: Module = {
  create: updateDataset,
  update: updateDataset,
};