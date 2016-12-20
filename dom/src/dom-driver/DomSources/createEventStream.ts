import { Stream, multicast } from 'most';
import { domEvent } from '@most/dom-event';

export function createEventStream (
  eventType: string,
  useCapture: boolean,
) {
  return function (element: Element): Stream<Event> {
    return multicast(domEvent(eventType, element, useCapture));
  };
}
