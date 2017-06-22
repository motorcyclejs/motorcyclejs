import { DomSource, EventsFnOptions, StandardEvents } from '../types'

import { EventDelegator } from './EventDelegator'
import { MotorcycleDomSource } from './MotorcycleDomSource'
import { SCOPE_PREFIX } from './common'
import { Stream } from 'most'
import { VNode } from 'mostly-dom'
import { domEvent } from '@most/dom-event'
import { elementMap } from './elementMap'
import { shouldUseCapture } from './shouldUseCapture'

export class ElementDomSource implements DomSource {
  protected _rootElement$: Stream<Element>
  protected _namespace: Array<string>
  protected _delegator: EventDelegator
  protected _element: Element

  constructor(
    rootElement$: Stream<Element>,
    namespace: Array<string>,
    delegator: EventDelegator = new EventDelegator(),
    element: Element,
  ) {
    this._rootElement$ = rootElement$
    this._namespace = namespace
    this._delegator = delegator
    this._element = element
  }

  public namespace(): Array<string> {
    return this._namespace
  }

  public select(cssSelector: string): DomSource {
    const trimmedSelector = cssSelector.trim()

    if (elementMap.has(trimmedSelector))
      return new ElementDomSource(
        this._rootElement$,
        this._namespace,
        this._delegator,
        elementMap.get(trimmedSelector) as Element,
      )

    const amendedNamespace = trimmedSelector === `:root`
      ? this._namespace
      : this._namespace.concat(trimmedSelector)

    return new MotorcycleDomSource(
      this._rootElement$,
      amendedNamespace,
      this._delegator,
    )
  }

  public elements<T extends Element>(): Stream<Array<T>> {
    return this._rootElement$.constant([ this._element as T ])
  }

  public events<T extends Event>(eventType: StandardEvents | string, options: EventsFnOptions = {}): Stream<T> {
    const useCapture: boolean =
      shouldUseCapture(eventType, options.useCapture || false)

    const event$: Stream<T> =
      domEvent(eventType, this._element, useCapture) as Stream<T>

    return this._rootElement$
      .constant(event$)
      .switch()
      .multicast()
  }

  public isolateSource(source: DomSource, scope: string) {
    return source.select(SCOPE_PREFIX + scope)
  }

  public isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode> {
    return sink.tap((vNode) => {
      if (!vNode.scope)
        vNode.scope = SCOPE_PREFIX + scope

      if (!vNode.key) vNode.key = SCOPE_PREFIX + scope
    })
  }
}
