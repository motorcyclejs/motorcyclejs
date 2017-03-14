import { Subject } from 'most-subject';
import { Subscription } from 'most';
import { disposeSources } from './disposeSources';
import { unsubscribeSubscriptions } from './unsubscribeSubscriptions';

export function createDispose<Sources, Sinks>(
  disposableSubject: Subject<void>,
  sources: Sources,
  subscriptions: Array<Subscription<any>>)
{
  return function dispose() {
    disposableSubject.next(void 0);
    unsubscribeSubscriptions(subscriptions);
    disposeSources(sources);
  };
}
