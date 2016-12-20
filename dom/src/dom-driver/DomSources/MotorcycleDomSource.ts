import { Stream } from 'most';
import { copy } from '@most/prelude';
import { domEvent } from '@most/dom-event';
import { EventDelegator, EventListenerInput } from './EventDelegator';
import { DomSource, EventsFnOptions, StandardEvents, VNode, VNodeData } from '../../types';
import { shouldUseCapture } from './shouldUseCapture';
import { ElementDomSource } from './ElementDomSource';
import { elementMap } from './elementMap';
import { SCOPE_PREFIX } from './common';
import { isInScope } from './isInScope';
import { generateScope, generateSelector } from './namespaceParsers';
import { createEventStream } from './createEventStream';

const SCOPE_SEPARATOR = `~`;

export class MotorcycleDomSource implements DomSource {
  protected _rootElement$: Stream<HTMLElement>;
  protected _namespace: Array<string>;
  protected _delegator: EventDelegator;
  protected _selector: string;
  protected _scope: string;

  constructor(
    rootElement$: Stream<HTMLElement>,
    namespace: Array<string>,
    delegator: EventDelegator = new EventDelegator(),
  ) {
    this._rootElement$ = rootElement$;
    this._namespace = namespace;
    this._delegator = delegator;
    this._scope = generateScope(namespace);
    this._selector = generateSelector(namespace);
  }

  public namespace(): Array<string> {
    return this._namespace;
  }

  public select(cssSelector: string): DomSource {
    const trimmedSelector = cssSelector.trim();

    if (trimmedSelector === ':root') return this;

    if (elementMap.has(trimmedSelector))
      return new ElementDomSource(
        this._rootElement$,
        this._namespace,
        this._delegator,
        elementMap.get(trimmedSelector) as HTMLElement,
      );

    return new MotorcycleDomSource(
      this._rootElement$,
      this._namespace.concat(trimmedSelector),
      this._delegator,
    );
  }

  public elements(): Stream<Element[]> {
    const namespace = this._namespace;

    if (namespace.length === 0)
      return this._rootElement$.map(Array);

    const selector = this._selector;
    const scope = this._scope;
    const matchElement = findMatchingElements(selector, isInScope(scope));

    return this._rootElement$.map(matchElement);
  }

  public events<T extends Event>(eventType: StandardEvents, options?: EventsFnOptions): Stream<T>;
  public events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>;
  public events(eventType: StandardEvents, options: EventsFnOptions = {}) {
    const namespace = this._namespace;

    const useCapture = shouldUseCapture(eventType, options.useCapture || false);

    if (namespace.length === 0)
      return this._rootElement$
        // take(1) is added because the rootElement will never be patched, because
        // the comparisons inside of makDomDriver only compare tagName, className,
        // and id. Attributes and properties will never be altered by the virtual-dom.
        .take(1)
        .map(element => domEvent(eventType, element, useCapture))
        .switch()
        .multicast();

    const delegator = this._delegator;
    const scope = this._scope;
    const selector = this._selector;

    const eventListenerInput: EventListenerInput =
      this.createEventListenerInput(eventType, useCapture);

    const checkElementIsInScope = isInScope(scope);

    return this._rootElement$
      .map(findMostSpecificElement(this._scope))
      .skipRepeats()
      .map(function createScopedEventStream(element: Element) {
        const event$ = delegator.addEventListener(element, eventListenerInput);

        return scopeEventStream(event$, checkElementIsInScope, selector, element);
      })
      .switch()
      .multicast();
  }

  public isolateSource(source: DomSource, scope: string) {
    return source.select(SCOPE_PREFIX + scope);
  }

  public isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode> {
    return sink.tap(vNode => {
      const prefixedScope = SCOPE_PREFIX + scope;

      if (!(vNode.data as VNodeData).isolate)
        (vNode.data as VNodeData).isolate = prefixedScope;

      if (!vNode.key) vNode.key = prefixedScope;
    });
  }

  private createEventListenerInput(eventType: string, useCapture: boolean) {
    const scope = this._scope;
    const delegator = this._delegator;

    const scopeMap = delegator.findScopeMap(eventType);
    const createEventStreamFromElement =
      createEventStream(eventType, useCapture);

    const scopeWithUseCapture: string =
      scope + SCOPE_SEPARATOR + useCapture;

    return {
      scopeMap,
      createEventStreamFromElement,
      scope: scopeWithUseCapture,
    };
  }
}

function findMostSpecificElement(scope: string) {
  return function queryForElement (rootElement: Element): Element {
    return rootElement.querySelector(`[data-isolate='${scope}']`) || rootElement;
  };
};

function findMatchingElements(selector: string, checkIsInScope: (element: HTMLElement) => boolean) {
  return function (element: HTMLElement): Array<HTMLElement> {
    const matchedNodes = element.querySelectorAll(selector);
    const matchedNodesArray = copy(matchedNodes as any as Array<any>);

    if (element.matches(selector))
      matchedNodesArray.push(element);

    return matchedNodesArray.filter(checkIsInScope);
  };
}

function scopeEventStream(
  eventStream: Stream<Event>,
  checkElementIsInScope: (element: Element) => boolean,
  selector: string,
  element: Element,
): Stream<Event> {
  return eventStream
    .filter(ev => checkElementIsInScope(ev.target as HTMLElement))
    .filter(ev => ensureMatches(selector, element, ev))
    .multicast();
}

function ensureMatches(selector: string, element: Element, ev: Event) {
  return !selector ||
    (ev.target as Element).matches(selector) ||
    element.matches(selector);
}
