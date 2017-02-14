import { Component, Sinks, Sources } from '@motorcycle/run';
import { ElementVNode, Module, VNode, elementToVNode, init } from 'mostly-dom';
import { Stream, map, scan } from 'most';

import { DomSource } from './types';
import { MotorcycleDomSource } from './DomSources';
import { hold } from 'most-subject';
import { vNodeWrapper } from './vNodeWrapper';

export interface DomSinks extends Sinks {
  view$: Stream<VNode>;
}

export interface DomSources extends Sources {
  dom: DomSource;
}

export interface DomComponent extends Component<DomSources, DomSinks> {}

export function makeDomComponent(
  rootElement: HTMLElement,
  options: DomDriverOptions = { modules: [] })
{
  const modules = options.modules || [];
  const patch = init(modules);
  const rootVNode = elementToVNode(rootElement);
  const wrapVNodeInRootElement = vNodeWrapper(rootElement);

  return function Dom(sinks: DomSinks): DomSources {
    const { view$ } = sinks;

    const rootVNode$: Stream<VNode> =
      scan<VNode, ElementVNode>(patch, rootVNode, map(wrapVNodeInRootElement, view$));

    const rootElement$: Stream<HTMLElement> =
      map(vNodeToElement, rootVNode$).thru(hold(1));

    rootElement$.drain()
      .catch(err => console.error('Error in DomComponent:', err))
      .then(() => console.log('Dom Component has terminated'));

    const dom = new MotorcycleDomSource(rootElement$, []);

    return { dom };
  };
}

function vNodeToElement(vNode: ElementVNode): HTMLElement {
  return vNode.element as HTMLElement;
}

export interface DomDriverOptions {
  modules: Array<Module>;
}
