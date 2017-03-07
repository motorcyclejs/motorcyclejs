import { DomSource, events } from '../../../../dom/src';
import { Stream, constant, delay, during, just, multicast } from 'most';

const touchStart = events('touchstart');
const touchEnd = events('touchend');
const TAP_DELAY = 300; // milliseconds

export function touchTap(dom: DomSource): Stream<Event> {
  const touchStart$: Stream<Event> = touchStart(dom);
  const touchEnd$: Stream<Event> = touchEnd(dom);

  const timeWindow$: Stream<Stream<void>> =
    multicast(constant(delay(TAP_DELAY, just(void 0)), touchStart$));

  return multicast(during(timeWindow$, touchEnd$));
}
