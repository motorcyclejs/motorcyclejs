import { Stream } from 'most';
import { domEvent } from '@most/dom-event';
import { EventDelegator } from './EventDelegator';
import { DomSource, EventsFnOptions, StandardEvents, VNode } from '../../types';
import { shouldUseCapture } from './shouldUseCapture';
import { MotorcycleDomSource } from './MotorcycleDomSource';
import { elementMap } from './elementMap';
import { SCOPE_PREFIX } from './common';

export class ElementDomSource implements DomSource {
  protected _rootElement$: Stream<HTMLElement>;
  protected _namespace: Array<string>;
  protected _delegator: EventDelegator;
  protected _element: HTMLElement;

  constructor(
    rootElement$: Stream<HTMLElement>,
    namespace: Array<string>,
    delegator: EventDelegator = new EventDelegator(),
    element: HTMLElement,
  ) {
    this._rootElement$ = rootElement$;
    this._namespace = namespace;
    this._delegator = delegator;
    this._element = element;
  }

  public namespace(): Array<string> {
    return this._namespace;
  }

  public select(cssSelector: string): DomSource {
    const trimmedSelector = cssSelector.trim();

    if (elementMap.has(trimmedSelector))
      return new ElementDomSource(
        this._rootElement$,
        this._namespace,
        this._delegator,
        elementMap.get(trimmedSelector) as HTMLElement,
      );

    const amendedNamespace = trimmedSelector === `:root`
      ? this._namespace
      : this._namespace.concat(trimmedSelector);

    return new MotorcycleDomSource(
      this._rootElement$,
      amendedNamespace,
      this._delegator,
    );
  }

  public elements(): Stream<Element[]> {
    return this._rootElement$.constant([this._element]);
  }

  public events<T extends Event>(eventType: StandardEvents, options?: EventsFnOptions): Stream<T>;
  public events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>;
  public events(eventType: StandardEvents, options: EventsFnOptions = {}) {
    const useCapture: boolean =
      shouldUseCapture(eventType, options.useCapture || false);

    const event$: Stream<Event> =
      domEvent(eventType, this._element, useCapture);

    return this._rootElement$
      .constant(event$)
      .switch()
      .multicast();
  }

  public isolateSource(source: DomSource, scope: string) {
    return source.select(SCOPE_PREFIX + scope);
  }

  public isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode> {
    return sink.tap(vNode => {
      if (!vNode.data) vNode.data = {};

      if (!vNode.data.isolate)
        vNode.data.isolate = SCOPE_PREFIX + scope;

      if (!vNode.key) vNode.key = SCOPE_PREFIX + scope;
    });
  }
}