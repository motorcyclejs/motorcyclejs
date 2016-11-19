import { VNode } from './interfaces'
import { DOMSource } from './DOMSource';
import { Stream, empty } from 'most'
import { Subject, sync } from 'most-subject'
import hold from '@most/hold'
import { domEvent } from '@most/dom-event';
import { ElementFinder } from './ElementFinder'
import { isolateSink, isolateSource } from './isolate'
import { IsolateModule } from './modules/isolate'
import { EventDelegator } from './EventDelegator'
import { getScope } from './util'
import { BodyDOMSource } from './BodyDOMSource';
import { DocumentDOMSource } from './DocumentDOMSource';
import { WindowDOMSource } from './WindowDOMSource';

const eventTypesThatDontBubble = [
  `blur`,
  `canplay`,
  `canplaythrough`,
  `change`,
  `durationchange`,
  `emptied`,
  `ended`,
  `focus`,
  `load`,
  `loadeddata`,
  `loadedmetadata`,
  `mouseenter`,
  `mouseleave`,
  `pause`,
  `play`,
  `playing`,
  `ratechange`,
  `reset`,
  `scroll`,
  `seeked`,
  `seeking`,
  `stalled`,
  `submit`,
  `suspend`,
  `timeupdate`,
  `unload`,
  `volumechange`,
  `waiting`,
]

export interface EventsFnOptions {
  useCapture?: boolean
}

function determineUseCapture (eventType: string, options: EventsFnOptions | undefined): boolean {
  let result = false
  if (!options) {
    options = {}
  }
  if (typeof options.useCapture === `boolean`) {
    result = options.useCapture as boolean
  }
  if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
    result = true
  }
  return result
}

export class MainDOMSource implements DOMSource {
  constructor(protected _rootElement$: Stream<HTMLElement>,
              protected _namespace: string[] = [],
              public _isolateModule: IsolateModule,
              public _delegators: Map<string, EventDelegator>) { }

  elements(): Stream<HTMLElement[]> {
    if (this._namespace.length === 0) {
      return hold(this._rootElement$.map<HTMLElement[]>((element: HTMLElement) => [element]))
    }

    const elementFinder = new ElementFinder(this._namespace, this._isolateModule)
    return hold(this._rootElement$.map<HTMLElement[]>((element: HTMLElement) => elementFinder.call(element) as HTMLElement[]))
  }

  get namespace() {
    return this._namespace
  }

  select (selector: string): DOMSource {
    if (typeof selector !== 'string') {
      throw new Error(`DOM driver's select() expects the argument to be a ` +
        `string as a CSS selector`);
    }
    const trimmedSelector = selector.trim();

    if (trimmedSelector === 'window')
      return new WindowDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    if (trimmedSelector === 'document')
      return new DocumentDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    if (trimmedSelector === 'body')
      return new BodyDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    const childNamespace = trimmedSelector === `:root`
      ? this._namespace
      : this._namespace.concat(trimmedSelector)

    return new MainDOMSource(
      this._rootElement$,
      childNamespace,
      this._isolateModule,
      this._delegators
    )
  }

  events (eventType: string, options?: EventsFnOptions) {
    if (typeof eventType !== `string`) {
      throw new Error(`DOM driver's events() expects argument to be a ` +
        `string representing the event type to listen for.`)
    }
    const useCapture: boolean = determineUseCapture(eventType, options)

    const namespace = this._namespace
    const scope = getScope(namespace)
    const keyParts = [eventType, useCapture]
    if (scope) {
      keyParts.push(scope)
    }
    const key = keyParts.join('~')
    const domSource = this
    let rootElement$: Stream<HTMLElement>
    if (scope) {
      let hadIsolated_mutable = false
      rootElement$ = this._rootElement$
        .filter(() => {
          const hasIsolated = !!domSource._isolateModule.getIsolatedElement(scope)
          const shouldPass = hasIsolated && !hadIsolated_mutable
          hadIsolated_mutable = hasIsolated
          return shouldPass
        })
        .multicast()
    } else {
      rootElement$ = this._rootElement$.take(2).multicast();
    }

    return rootElement$
      .map(function setupEventDelegatorOnTopElement(rootElement) {
        // Event listener just for the root element
        if (!namespace || namespace.length === 0) {
          return domEvent(eventType, rootElement, useCapture)
        }
        // Event listener on the top element as an EventDelegator
        const delegators = domSource._delegators
        const top = scope
          ? domSource._isolateModule.getIsolatedElement(scope)
          : rootElement
        let delegator: EventDelegator
        if (delegators.has(key)) {
          delegator = delegators.get(key) as EventDelegator
          delegator.updateTopElement(top as HTMLElement)
        } else {
          delegator = new EventDelegator(
            top as HTMLElement, eventType, useCapture, domSource._isolateModule
          )
          delegators.set(key, delegator)
        }
        if (scope) {
          domSource._isolateModule.addEventDelegator(scope, delegator)
        }

        const destinationId = delegator.createDestinationId();

        const eventSubject: Subject<Event> =
          sync<Event>();

        const stream: Stream<Event> =
          eventSubject
            .continueWith(() => {
              delegator.removeDestinationId(destinationId);
              return empty();
            })

        delegator.addDestination(eventSubject, namespace, destinationId, top as HTMLElement);

        return stream;
      })
      .switch()
      .multicast()
  }

  dispose(): void {
    this._isolateModule.reset()
  }

  public isolateSource: (source: DOMSource, scope: string) => DOMSource = isolateSource
  public isolateSink: (sink: Stream<VNode>, scope: string) => Stream<VNode> = isolateSink
}
