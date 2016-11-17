import { Stream, Subscriber, Subscription, empty } from 'most';
import { HoldSubject, hold, sync } from 'most-subject';
import { Location, History, Unsubscribe } from 'history';
import { HistoryInput } from './types';

export function createHistory$ (
  history: History,
  sink$: Stream<HistoryInput | string>): Stream<Location>
{
  const push = makePushState(history);

  const history$: HoldSubject<Location> =
    hold<Location>(1, sync<Location>());

  const unlisten: Unsubscribe =
    history.listen((location: Location) => {
      history$.next(location);
    });

  const subscription: Subscription<HistoryInput> =
    sink$
      .continueWith(() => {
        history$.complete();
        return empty();
      })
      .subscribe(createObserver(push, unlisten));

  // allow clean up of this subscription
  (history$ as any).dispose = () => subscription.unsubscribe();

  return history$.startWith(history.location);
};

function makePushState (history: History) {
  return function pushState (input: HistoryInput): void {
    if (input.type === 'push')
      history.push(input.pathname, input.state);

    if (input.type === 'replace')
      history.replace(input.pathname, input.state);

    if (input.type === 'go')
      history.go(input.amount);

    if (input.type === 'goBack')
      history.goBack();

    if (input.type === 'goForward')
      history.goForward();
  };
}

function createObserver (push: (input: HistoryInput) => any,
                         unlisten: Function): Subscriber<HistoryInput> {
  return {
    next (input: HistoryInput | string) {
      if (typeof input === 'string')
        push({ type: 'push', pathname: input });
      else
        push(input as HistoryInput);
    },
    error: () => unlisten(),
    complete: () => unlisten(),
  };
}