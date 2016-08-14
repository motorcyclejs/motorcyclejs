import { Stream } from 'most'

export interface VNodeData {
  // modules - use any because Object type is useless
  props?: any;
  attrs?: any;
  class?: any;
  style?: any;
  dataset?: any;
  on?: any;
  hero?: any;
  // end of modules
  hook?: Hooks;
  key?: string | number;
  ns?: string; // for SVGs
  fn?: () => VNode; // for thunks
  args?: Array<any>; // for thunks
  // Cycle.js only
  isolate?: string
  static?: boolean
}

export interface VNode {
  sel: string | undefined;
  data?: VNodeData | undefined;
  children?: Array<VNode | string | Stream<VNode> | null> | undefined;
  elm?: HTMLElement | Text | undefined;
  text?: string | undefined;
  key?: string | number | undefined;
}

export interface ThunkData extends VNodeData {
  fn: () => VNode;
  args: Array<any>;
}

export interface Thunk extends VNode {
  data: ThunkData;
}

export type PreHook = () => any;
export type InitHook = (vNode: VNode) => any;
export type CreateHook = (emptyVNode: VNode, vNode: VNode) => any;
export type InsertHook = (vNode: VNode) => any;
export type PrePatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type UpdateHook = (oldVNode: VNode, vNode: VNode) => any;
export type PostPatchHook = (oldVNode: VNode, vNode: VNode) => any;
export type DestroyHook = (vNode: VNode) => any;
export type RemoveHook = (vNode: VNode, removeCallback: () => void) => any;
export type PostHook = () => any;

export interface Hooks {
  pre?: PreHook;
  init?: InitHook;
  create?: CreateHook;
  insert?: InsertHook;
  prepatch?: PrePatchHook;
  update?: UpdateHook;
  postpatch?: PostPatchHook;
  destroy?: DestroyHook;
  remove?: RemoveHook;
  post?: PostHook;
}

export interface Module {
  pre?: PreHook;
  create?: CreateHook;
  update?: UpdateHook;
  destroy?: DestroyHook;
  remove?: RemoveHook;
  post?: PostHook;
}
