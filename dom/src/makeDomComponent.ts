import { ElementVirtualNode, Module, VirtualNode, elementToVNode, init } from 'mostly-dom'
import { Stream, drain, map, scan } from 'most'
import { Subject, hold } from 'most-subject'

import { Component } from '@motorcycle/run'
import { DomSource } from './types'
import { MotorcycleDomSource } from './DomSources'
import { vNodeWrapper } from './vNodeWrapper'

export type DomSinks<T extends Element> =
  { readonly [key: string]: Stream<any> } &
  { view$: Stream<VirtualNode<T>> }

export interface DomSources<T extends Element> {
  dom: DomSource<T>
}

export interface DomComponent<T extends Element = Element> extends Component<DomSources<T>, DomSinks<T>> {}

export function makeDomComponent<T extends Element>(
  rootElement: T,
  options: DomDriverOptions = { modules: [] })
{
  const modules = options.modules || []
  const patch = init(modules)
  const rootVNode = elementToVNode(rootElement) as ElementVirtualNode<T>
  const wrapVNodeInRootElement = vNodeWrapper(rootElement)

  return function Dom(sinks: DomSinks<T>): DomSources<T> {
    const { view$ } = sinks

    const rootVNode$: Stream<ElementVirtualNode<T>> =
      scan<VirtualNode<T>, ElementVirtualNode<T>>(
        (elementVNode: ElementVirtualNode<T>, vNode: VirtualNode<T>) => patch<T>(elementVNode, vNode),
        rootVNode,
        map(wrapVNodeInRootElement, view$) as any,
      )

    const rootElement$: Stream<T> =
      hold(1, map((vNode: ElementVirtualNode<T>) => vNodeToElement<T>(vNode), rootVNode$) as any)

    drain(rootElement$)
      .catch((err) => console.error('Error in DomComponent:', err))
      .then(() => console.log('Dom Component has terminated'))

    const dom = new MotorcycleDomSource<T>(rootElement$, [])

    return { dom }
  }
}

function vNodeToElement<T extends Element>(vNode: ElementVirtualNode<T>): T {
  return vNode.element as T
}

export interface DomDriverOptions {
  modules: Array<Module<Element>>
}
