import { Stream, map, scan } from 'most';
import { hold } from 'most-subject';
import { DriverFn } from '@motorcycle/core';
import { vNodeWrapper } from './vNodeWrapper';
import { MotorcycleDomSource } from './DomSources';
import { init } from '../virtual-dom';
import {
  IsolateModule,
  StyleModule,
  ClassModule,
  PropsModule,
  AttrsModule,
  DatasetModule,
} from '../modules';
import { DomSource, VNode, Module } from '../types';
import { emptyNodeAt } from '../virtual-dom/util';

const defaultModules = [StyleModule, ClassModule, PropsModule, AttrsModule, DatasetModule];

export function makeDomDriver(
  rootElement: HTMLElement,
  options: DomDriverOptions = { modules: defaultModules }): DriverFn
{
  const modules = options.modules || defaultModules;
  const patch = init(modules.concat(new IsolateModule()));
  const rootVNode = emptyNodeAt(rootElement);
  const wrapVNodeInRootElement = vNodeWrapper(rootElement);

  return function DomDriver(vNode$: Stream<VNode>): DomSource {
    const rootVNode$: Stream<VNode> =
      scan<VNode, VNode>(patch, rootVNode, map(wrapVNodeInRootElement, vNode$));

    const rootElement$: Stream<HTMLElement> =
      map(vNodeToElement, rootVNode$).thru(hold(1));

    rootElement$.drain()
      .catch(err => console.error(err))
      .then(() => console.log('Dom Driver has terminated'));

    return new MotorcycleDomSource(rootElement$, []);
  };
}

function vNodeToElement(vNode: VNode): HTMLElement {
  return vNode.elm as HTMLElement;
}

export interface DomDriverOptions {
  modules: Array<Module>;
}
