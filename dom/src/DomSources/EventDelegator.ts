import { Stream } from 'most';

export type EventType = string;
export type Scope = string;
export type ScopeMap = Map<Scope, Stream<Event>>;
export type EventMap = Map<EventType, ScopeMap>;

export type EventListenerInput =
  {
    scope: Scope,
    scopeMap: ScopeMap,
    createEventStreamFromElement: (element: Element) => Stream<Event>,
  };

export class EventDelegator {
  private eventMap: EventMap = new Map();

  public addEventListener(element: Element, input: EventListenerInput): Stream<Event> {
    const { scope, scopeMap, createEventStreamFromElement } = input;

    if (scopeMap.has(scope))
      return scopeMap.get(scope) as Stream<Event>;

    const scopedEventStream = createEventStreamFromElement(element);
    scopeMap.set(scope, scopedEventStream);

    return scopedEventStream;
  }

  public findScopeMap(eventType: EventType) {
    const eventMap = this.eventMap;

    return eventMap.has(eventType)
      ? eventMap.get(eventType) as Map<Scope, Stream<Event>>
      : addScopeMap(eventMap, eventType);
  }
}

function addScopeMap(eventMap: EventMap, eventType: EventType) {
  const scopeMap: ScopeMap = new Map<Scope, Stream<Event>>();

  eventMap.set(eventType, scopeMap);

  return scopeMap;
}