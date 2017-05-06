import { DomSource, EventsFnOptions, StandardEvents } from '../types'
import { EventDelegator, EventListenerInput } from './EventDelegator'
import { SCOPE_ATTRIBUTE, VNode, VNodeProps, h } from 'mostly-dom'
import { generateScope, generateSelector } from './namespaceParsers'

import { ElementDomSource } from './ElementDomSource'
import { SCOPE_PREFIX } from './common'
import { Stream } from 'most'
import { copy } from '@most/prelude'
import { createEventStream } from './createEventStream'
import { domEvent } from '@most/dom-event'
import { elementMap } from './elementMap'
import { isInScope } from './isInScope'
import { shouldUseCapture } from './shouldUseCapture'

const SCOPE_SEPARATOR = `~`

export class MotorcycleDomSource<T extends Element> implements DomSource<T> {
  protected _rootElement$: Stream<T>
  protected _namespace: Array<string>
  protected _delegator: EventDelegator
  protected _selector: string
  protected _scope: string

  constructor(
    rootElement$: Stream<T>,
    namespace: Array<string>,
    delegator: EventDelegator = new EventDelegator(),
  ) {
    this._rootElement$ = rootElement$
    this._namespace = namespace
    this._delegator = delegator
    this._scope = generateScope(namespace)
    this._selector = generateSelector(namespace)
  }

  public namespace(): Array<string> {
    return this._namespace
  }

  public select<R extends Element>(cssSelector: string): DomSource<R> {
    const trimmedSelector = cssSelector.trim()

    if (trimmedSelector === ':root') return this

    if (elementMap.has(trimmedSelector))
      return new ElementDomSource(
        this._rootElement$,
        this._namespace,
        this._delegator,
        elementMap.get(trimmedSelector) as HTMLElement,
      )

    return new MotorcycleDomSource<R>(
      this._rootElement$ as any as Stream<R>,
      this._namespace.concat(trimmedSelector),
      this._delegator,
    )
  }

  public elements(): Stream<Array<T>> {
    const namespace = this._namespace

    if (namespace.length === 0)
      return this._rootElement$.map(Array)

    const selector = this._selector
    const scope = this._scope

    if (!selector)
      return this._rootElement$.map(findMostSpecificElement(scope)).map(Array)

    const matchElement = findMatchingElements<T>(selector, isInScope(scope))

    return this._rootElement$.map(matchElement)
  }

  public events<E extends Event>(eventType: StandardEvents | string, options: EventsFnOptions = {}) {
    const namespace = this._namespace

    const useCapture = shouldUseCapture(eventType, options.useCapture || false)

    if (namespace.length === 0)
      return this._rootElement$
        // take(1) is added because the rootElement will never be patched, because
        // the comparisons inside of makDomDriver only compare tagName, className,
        // and id. Attributes and properties will never be altered by the virtual-dom.
        .take(1)
        .map((element) => domEvent(eventType, element, useCapture))
        .switch()
        .multicast() as Stream<E>

    const delegator = this._delegator
    const scope = this._scope
    const selector = this._selector

    const eventListenerInput: EventListenerInput =
      this.createEventListenerInput(eventType, useCapture)

    const checkElementIsInScope = isInScope(scope)

    return this._rootElement$
      .map(findMostSpecificElement(this._scope))
      .skipRepeats()
      .map(function createScopedEventStream(element: Element) {
        const event$ = delegator.addEventListener(element, eventListenerInput)

        return scopeEventStream(event$, checkElementIsInScope, selector, useCapture, element)
      })
      .switch()
      .multicast() as Stream<E>
  }

  public isolateSource<D extends DomSource>(source: D, scope: string): D {
    return source.select(SCOPE_PREFIX + scope) as D
  }

  public isolateSink<V extends VNode>(sink: Stream<V>, scope: string): Stream<V> {
    const prefixedScope = SCOPE_PREFIX + scope

    return sink.tap((vNode) => {
      if (!vNode.scope)
        vNode.scope = prefixedScope

      if (Array.isArray(vNode.children))
        addScopeToChildren(vNode.children, prefixedScope)

      if (!vNode.key)
        vNode.key = prefixedScope
    })
  }

  private createEventListenerInput(eventType: string, useCapture: boolean) {
    const scope = this._scope
    const delegator = this._delegator

    const scopeMap = delegator.findScopeMap(eventType)
    const createEventStreamFromElement =
      createEventStream(eventType, useCapture)

    const scopeWithUseCapture: string =
      scope + SCOPE_SEPARATOR + useCapture

    return {
      scopeMap,
      createEventStreamFromElement,
      scope: scopeWithUseCapture,
    }
  }
}

function addScopeToChildren(children: Array<VNode> | void, scope: string) {
  if (!children) return

  const count = children.length

  for (let i = 0; i < count; ++i) {
    const child = children[i]

    if (child.scope) continue

    child.scope = scope

    if (Array.isArray(child.children))
      addScopeToChildren(child.children, scope)
  }
}

function findMostSpecificElement(scope: string) {
  return function queryForElement(rootElement: Element): Element {
    return rootElement.querySelector(`[${SCOPE_ATTRIBUTE}='${scope}']`) || rootElement
  }
}

function findMatchingElements<T extends Element>(selector: string, checkIsInScope: (element: HTMLElement) => boolean) {
  return function(element: T): Array<T> {
    const matchedNodes = element.querySelectorAll(selector)
    const matchedNodesArray = copy(matchedNodes as any as Array<any>)

    if (element.matches(selector))
      matchedNodesArray.push(element)

    return matchedNodesArray.filter(checkIsInScope)
  }
}

function scopeEventStream(
  eventStream: Stream<Event>,
  checkElementIsInScope: (element: Element) => boolean,
  selector: string,
  useCapture: boolean,
  element: Element,
): Stream<Event> {
  return eventStream
    .filter((ev: Event) => {
      if (useCapture)
        return element.contains(ev.target as HTMLElement)

      return checkElementIsInScope(ev.target as HTMLElement)
    })
    .filter((ev) => ensureMatches(selector, element, ev))
    .map((ev: Event) => {
      if (useCapture)
        return cloneEvent(ev, findCurrentTarget(selector, element, ev))

      return ev
    })
    .multicast()
}

function findCurrentTarget(selector: string, element: Element, ev: Event): Element {
  if (!selector || element.matches(selector))
    return element

  const matchedNodes = element.querySelectorAll(selector)

  for (let i = 0; i < matchedNodes.length; ++i) {
    if (matchedNodes[i].contains(ev.target as Element)) {
      return matchedNodes[i]
    }
  }

  return ev.currentTarget as Element
}

function cloneEvent(event: Event, currentTarget: Element): Event {
  return new Proxy(event, {
    get(target: Event, property: string) {
      return property === 'currentTarget' ? currentTarget : target[property]
    },
  })
}

function ensureMatches(selector: string, element: Element, ev: Event) {
  if (!selector) return true

  let target = ev.target as Element

  for (; target && target !== element; target = target.parentElement as Element)
    if (target.matches(selector))
      return true

  return element.matches(selector)
}
