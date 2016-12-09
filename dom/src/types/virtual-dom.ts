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

export interface SnabbdomAPI<A, B, C> {
  createElement(tagName: string): A;
  createElementNS(namespaceURI: string, qualifiedName: string): A;
  createTextNode(text: string): B;
  insertBefore(parentNode: A | B, newNode: A | B, referenceNode: A | B): void;
  removeChild(node: A | B, child: A | B): void;
  appendChild(node: A, child: A | B): void;
  parentNode(node: A | B): A | B;
  nextSibling(node: A | B): A | C;
  tagName(node: A): string;
  setTextContent(node: A | B, text: string): void;
}

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
  attachData?: any; // for attachTo()
  // Cycle.js only
  isolate?: string;
}

export interface VirtualNode<T extends Node> {
  tagName: string | undefined;
  className: string | undefined;
  id: string | undefined;
  data: VNodeData | undefined;
  children: Array<VNode> | undefined;
  elm: T | undefined;
  text: string | undefined;
  key: string | number | undefined;
}

export type VNode = VirtualNode<any>;
export type VNodeChildren = string | number | Array<string | VNode | null>;
