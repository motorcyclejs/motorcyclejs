import { Module, VNode } from '../types';

export class IsolateModule implements Module {
  public create(_: VNode, vNode: VNode) {
    this.setAndRemoveScopes(vNode);
  }

  public update(_: VNode, vNode: VNode) {
    this.setAndRemoveScopes(vNode);
  }

  private setAndRemoveScopes(vNode: VNode) {
    const scope = scopeFromVNode(vNode);

    if (!scope) return;

    (vNode.elm as HTMLElement).setAttribute('data-isolate', scope);

    addScopeToChildren(vNode.elm.children, scope);
  }
}

function addScopeToChildren(children: HTMLCollection, scope: string) {
  if (!children) return;

  const count = children.length;

  for (let i = 0; i < count; ++i) {
    const child = children[i];

    if (child.hasAttribute('data-isolate')) continue;

    child.setAttribute('data-isolate', scope);

    if (child.children)
      addScopeToChildren(child.children, scope);
  }
}

function scopeFromVNode(vNode: VNode) {
  return vNode.data && vNode.data.isolate || ``;
}