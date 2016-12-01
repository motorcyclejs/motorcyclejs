import { DriverFn } from '@motorcycle/core';
import { VNode, Module, init } from 'snabbdom-ts';
import { Stream } from 'most'
import hold from '@most/hold'
import { DomSource, MainDomSource } from './DomSources';
import { VNodeWrapper } from './VNodeWrapper'
import { getElement } from './util'
import { defaultModules, ClassModule } from './modules';
import { IsolateModule } from './modules/isolate'
import { EventDelegator } from './EventDelegator'

function mapVNodeToElement(vNode: VNode) {
  return vNode.elm ? vNode.elm as HTMLElement : vNode as any as HTMLElement
}

export interface DomDriverOptions {
  modules?: Array<Module>
}

export function makeDomDriver(container: string | HTMLElement, options: DomDriverOptions = {}): DriverFn {
  const modules = options.modules || defaultModules;
  const isolateModule = new IsolateModule((new Map<string, HTMLElement>()));
  const patch = init([isolateModule.createModule(), ClassModule].concat(modules));
  const rootElement = getElement(container);
  const vNodeWrapper = new VNodeWrapper(rootElement);
  const delegators = new Map<string, EventDelegator>();

  return function DomDriver(vNode$: Stream<VNode>): DomSource {
     const rootElement$ = vNode$
      .map(vNode => vNodeWrapper.call(vNode))
      .scan<VNode>(patch, (rootElement as any as VNode))
      .map(mapVNodeToElement)
      .thru(hold)

    rootElement$.tap(console.log).drain()
      .catch((err: Error) => console.error(err))
      .then(() => 'Dom Driver vnode$ has terminated')

    return new MainDomSource(rootElement$, [], isolateModule, delegators);
  }
}
