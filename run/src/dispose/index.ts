import { Object, Sink } from '../types';
import { Subscription } from 'most';
import { Subject } from 'most-subject';

import { disposeSources } from './disposeSources';
import { unsubscribeSubscriptions } from './unsubscribeSubscriptions';

export function createDispose<Sources extends Object<any>, Sinks extends Object<Sink<any>>>(
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
