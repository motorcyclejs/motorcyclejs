import { Stream } from 'most';
import hold from '@most/hold';
import { domEvent } from '@most/dom-event';
import { VNode } from 'snabbdom-ts';
import { IsolateModule } from '../modules/isolate';
import { EventDelegator } from '../EventDelegator';
import { DomSource, EventsFnOptions } from './DomSource';
import { select } from './select';
import { isolateSink, isolateSource } from './isolate';
import { shouldUseCapture } from './shouldUseCapture';

export class ElementDomSource implements DomSource {
  constructor(
    protected _rootElement$: Stream<HTMLElement>,
    protected _namespace: string[] = [],
    public _isolateModule: IsolateModule,
    public _delegators: Map<string, EventDelegator>,
    private _element: HTMLElement
  ) { }

  select(selector: string) {
    return select(selector, this._rootElement$, this._namespace, this._isolateModule, this._delegators);
  }

  elements(): Stream<HTMLElement[]> {
    return hold<HTMLElement[]>(this._rootElement$.constant([this._element]));
  }

  events<T extends Event>(eventType: string, options?: EventsFnOptions) {
    return this._rootElement$.constant(this._element)
      .map(element => domEvent(eventType, element, shouldUseCapture(eventType, options)) as Stream<T>)
      .switch()
      .multicast();
  }

  get namespace() {
    return this._namespace;
  }

  dispose(): void {
    this._isolateModule.reset();
  }

  public isolateSource: (source: DomSource, scope: string) => DomSource = isolateSource;
  public isolateSink: (sink: Stream<VNode>, scope: string) => Stream<VNode> = isolateSink;

}