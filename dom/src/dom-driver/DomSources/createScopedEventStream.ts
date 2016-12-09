import { Stream } from 'most';
import { domEvent } from '@most/dom-event';

export function createScopedEventStream (
  selector: string,
  eventType: string,
  useCapture: boolean,
  checkElementIsInScope: (element: Element) => boolean,
) {
  return function (element: Element): Stream<Event> {
    const ensureEventMatches = ensureMatches(selector, element);

    const eventStream = domEvent(eventType, element, useCapture);

    return scopeEventStream(eventStream, checkElementIsInScope, ensureEventMatches);
  };
}

function scopeEventStream(
  eventStream: Stream<Event>,
  checkElementIsInScope: (element: Element) => boolean,
  ensureEventMatches: (event: Event) => boolean,
): Stream<Event> {
  return eventStream
    .filter(ev => checkElementIsInScope(ev.target as HTMLElement))
    .filter(ensureEventMatches)
    .multicast();
}

function ensureMatches(selector: string, element: Element) {
  return function eventTargetMatches(ev: Event) {
    return isMatch(selector, ev.target as Element, element);
  };
}

function isMatch(selector: string, target: Element, rootElement: Element) {
  return !selector ||
    target.matches(selector) ||
    rootElement.matches(selector);
}