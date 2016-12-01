import { DomSource, EventsFnOptions } from './DomSource';
import { Stream, empty } from 'most';
import hold from '@most/hold';
import { Subject, sync } from 'most-subject';
import { domEvent } from '@most/dom-event';
import { VNode } from 'snabbdom-ts';
import { IsolateModule } from '../modules/isolate';
import { EventDelegator } from '../EventDelegator';
import { ElementFinder } from '../ElementFinder';
import { getScope } from '../util';
import { isolateSource, isolateSink } from './isolate';
import { select } from './select';
import { determineUseCapture } from './determineUseCapture';

export class MainDomSource implements DomSource {
  constructor(
    protected _rootElement$: Stream<HTMLElement>,
    protected _namespace: string[] = [],
    public _isolateModule: IsolateModule,
    public _delegators: Map<string, EventDelegator>) { }

  select(selector: string): DomSource {
    return select(selector, this._rootElement$, this._namespace, this._isolateModule, this._delegators);
  }

  elements(): Stream<HTMLElement[]> {
    if (this._namespace.length === 0) {
      return hold(this._rootElement$.map<HTMLElement[]>((element: HTMLElement) => [element]))
    }

    const elementFinder = new ElementFinder(this._namespace, this._isolateModule)
    return hold(
      this._rootElement$
        .map<HTMLElement[]>((element: HTMLElement) => elementFinder.call(element) as HTMLElement[])
    )
  }

  events (eventType: string, options?: EventsFnOptions) {
    if (typeof eventType !== `string`) {
      throw new Error(`Dom driver's events() expects argument to be a ` +
        `string representing the event type to listen for.`)
    }
    const useCapture: boolean = determineUseCapture(eventType, options);

    const namespace = this._namespace;
    const isolateModule = this._isolateModule;
    const delegators = this._delegators;

    const scope = getScope(namespace)
    const keyParts = [eventType, useCapture]

    if (scope)
      keyParts.push(scope)

    const key = keyParts.join('~')

    const rootElement$: Stream<HTMLElement> =
      getRootElement$(scope, isolateModule, this._rootElement$);

    return rootElement$
      .map(setupEventDelegator(eventType, useCapture, namespace, scope, key, isolateModule, delegators))
      .switch()
      .multicast()
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

function getRootElement$(scope: string, isolateModule: IsolateModule, rootElement$: Stream<HTMLElement>) {
  if (!scope) return this._rootElement$.take(2).multicast();

  let hadIsolated_mutable = false
  return rootElement$
    .filter(() => {
      const hasIsolated = !!isolateModule.getIsolatedElement(scope)
      const shouldPass = hasIsolated && !hadIsolated_mutable
      hadIsolated_mutable = hasIsolated
      return shouldPass
    })
    .multicast()
}

function setupEventDelegator(
  eventType: string,
  useCapture: boolean,
  namespace: Array<string>,
  scope: string,
  key: string,
  isolateModule: IsolateModule,
  delegators: Map<string, EventDelegator>,
) {
  return function (rootElement: HTMLElement) {
    // Event listener just for the root element
    if (!namespace || namespace.length === 0)
      return domEvent(eventType, rootElement, useCapture)

    // Event listener on the top element as an EventDelegator
    const top: HTMLElement = scope
      ? isolateModule.getIsolatedElement(scope) as HTMLElement
      : rootElement

    const hasDelegator: boolean = delegators.has(key);

    const delegator: EventDelegator = hasDelegator
      ? delegators.get(key) as EventDelegator
      : new EventDelegator(top, eventType, useCapture, isolateModule);

    if (hasDelegator)
      delegator.updateTopElement(top);
    else
      delegators.set(key, delegator);

    if (scope)
      isolateModule.addEventDelegator(scope, delegator)

    const destinationId: number = delegator.createDestinationId();

    const eventSubject: Subject<Event> = sync<Event>();

    const stream: Stream<Event> =
      eventSubject
        .continueWith(() => {
          delegator.removeDestinationId(destinationId);
          return empty();
        })
        .skipRepeats();

    delegator.addDestination(eventSubject, namespace, destinationId, top);

    return stream;
  }
}