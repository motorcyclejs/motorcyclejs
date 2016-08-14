declare const require: (package: string) => any
declare const requestIdleCallback: any;

import { VNode } from './interfaces'
import { Stream } from 'most'
import { Subject } from 'most-subject'
import { BasicSubjectSource } from 'most-subject/lib/SubjectSource'
import hold from '@most/hold'
const domEvent: (event: string, node: EventTarget, capture?: boolean) => Stream<Event> = require('@most/dom-event').domEvent
import { ElementFinder } from './ElementFinder'
import { isolateSink, isolateSource } from './isolate'
import { IsolateModule } from './modules/isolate'
import { EventDelegator } from './EventDelegator'
import { getScope } from './util'

interface MatchesSelector {
  (element: HTMLElement, selector: string): boolean;
}
let matchesSelector: MatchesSelector;
try {
  matchesSelector = require(`matches-selector`);
} catch (e) {
  matchesSelector = () => true
}

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

class EventSubjectSource extends BasicSubjectSource<Event> {
  constructor(private _disposeFn: () => any) {
    super()
  }

  _dispose() {
    super._dispose()
    if ('requestIdleCallback' in window) {
      requestIdleCallback(this._disposeFn);
    } else {
      this._disposeFn()
    }
  }
}

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

export class DOMSource {
  constructor(private _rootElement$: Stream<HTMLElement>,
              private _namespace: string[] = [],
              public _isolateModule: IsolateModule,
              public _delegators: Map<string, EventDelegator>) { }

  elements(): Stream<HTMLElement | HTMLElement[]> {
    if (this._namespace.length === 0) {
      return hold(this._rootElement$.map<HTMLElement>((element: HTMLElement) => element))
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
    const childNamespace = trimmedSelector === `:root`
      ? this._namespace
      : this._namespace.concat(trimmedSelector)
    return new DOMSource(
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
        const eventSubject = new Subject<Event>(new EventSubjectSource(() => {
          delegator.removeDestinationId(destinationId)
        }))

        delegator.addDestination(eventSubject, namespace, destinationId)
        return eventSubject
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
