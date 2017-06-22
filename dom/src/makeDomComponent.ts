import { ElementVNode, Module, VNode, elementToVNode, init } from 'mostly-dom'
import { Stream, drain, map, scan } from 'most'
import { Subject, hold } from 'most-subject'

import { Component } from '@motorcycle/run'
import { DomSource } from './types'
import { MotorcycleDomSource } from './DomSources'
import { vNodeWrapper } from './vNodeWrapper'

export type DomSinks =
  { readonly [key: string]: Stream<any> } &
  { view$: Stream<VNode> }

export interface DomSources {
  dom: DomSource
}

export interface DomComponent extends Component<DomSources, DomSinks> {}

export function makeDomComponent(
  rootElement: Element,
  options: DomDriverOptions = { modules: [] })
{
  const modules = options.modules || []
  const patch = init(modules)
  const rootVNode = elementToVNode(rootElement)
  const wrapVNodeInRootElement = vNodeWrapper(rootElement)

  return function Dom(sinks: DomSinks): DomSources {
    const { view$ } = sinks

    const rootVNode$: Stream<ElementVNode> =
      scan(patch, rootVNode, map(wrapVNodeInRootElement, view$))

    const rootElement$: Stream<Element> =
      hold(1, map(vNodeToElement, rootVNode$) as any)

    drain(rootElement$)
      .catch((err) => console.error('Error in DomComponent:', err))
      .then(() => console.log('Dom Component has terminated'))

    const dom = new MotorcycleDomSource(rootElement$, [])

    return { dom }
  }
}

function vNodeToElement(vNode: ElementVNode): Element {
  return vNode.element
}

export interface DomDriverOptions {
  modules: Array<Module<Element>>
}
