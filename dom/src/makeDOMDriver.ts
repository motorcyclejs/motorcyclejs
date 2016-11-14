declare const require: (package: string) => any
import { VNode, Module } from './interfaces'
const init: (modules: Module[]) => (oldVNode: VNode, vNode: VNode) => VNode = require('snabbdom').init
import { Stream } from 'most'
import hold from '@most/hold'
import { DOMSource } from './DOMSource';
import { MainDOMSource } from './MainDOMSource'
import { VNodeWrapper } from './VNodeWrapper'
import { getElement } from './util'
import defaultModules from './modules';
import { IsolateModule } from './modules/isolate'
import { transposeVNode } from './transposition'
import { EventDelegator } from './EventDelegator'

function mapVNodeToElement(vNode: VNode) {
  return vNode.elm ? vNode.elm as HTMLElement : vNode as any as HTMLElement
}

export interface DOMDriverOptions {
  modules?: Array<Module>
  transposition?: boolean
}

export function makeDOMDriver(container: string | HTMLElement, options?: DOMDriverOptions): Function {
  if (!options) { options = {} }
  const transposition = options.transposition || false;
  const modules = options.modules || defaultModules;
  const isolateModule = new IsolateModule((new Map<string, HTMLElement>()));
  const patch = init([isolateModule.createModule()].concat(modules));
  const rootElement = getElement(container);
  const vnodeWrapper = new VNodeWrapper(rootElement);
  const delegators = new Map<string, EventDelegator>();

  return function DOMDriver(vnode$: Stream<VNode>): DOMSource {
    const preprocessedVNode$ = transposition
      ? vnode$.map(transposeVNode).switch()
      : vnode$

    const rootElement$ = (preprocessedVNode$ as Stream<VNode>)
      .map(vnode => vnodeWrapper.call(vnode))
      .scan<VNode>(patch, (rootElement as any as VNode))
      .map(mapVNodeToElement)
      .thru(hold)

    rootElement$.drain()
      .catch((err: Error) => console.error(err))
      .then(() => 'DOM Driver vnode$ has terminated')

    return new MainDOMSource(rootElement$, [], isolateModule, delegators);
  }
}
