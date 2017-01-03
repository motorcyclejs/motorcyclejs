import { Stream, map, scan } from 'most';
import { hold } from 'most-subject';
import { DriverFn } from '@motorcycle/core';
import { init, elementToVNode, ElementVNode, VNode, Module } from 'mostly-dom';
import { vNodeWrapper } from './vNodeWrapper';
import { MotorcycleDomSource } from './DomSources';
import { DomSource } from './types';

export function makeDomDriver(
  rootElement: HTMLElement,
  options: DomDriverOptions = { modules: [] }): DriverFn
{
  const modules = options.modules || [];
  const patch = init(modules);
  const rootVNode = elementToVNode(rootElement);
  const wrapVNodeInRootElement = vNodeWrapper(rootElement);

  return function DomDriver(vNode$: Stream<VNode>): DomSource {
    const rootVNode$: Stream<VNode> =
      scan<VNode, ElementVNode>(patch, rootVNode, map(wrapVNodeInRootElement, vNode$));

    const rootElement$: Stream<HTMLElement> =
      map(vNodeToElement, rootVNode$).thru(hold(1));

    rootElement$.drain()
      .catch(err => console.error(err))
      .then(() => console.log('Dom Driver has terminated'));

    return new MotorcycleDomSource(rootElement$, []);
  };
}

function vNodeToElement(vNode: ElementVNode): HTMLElement {
  return vNode.element as HTMLElement;
}

export interface DomDriverOptions {
  modules: Array<Module>;
}
