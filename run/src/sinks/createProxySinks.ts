import { Subject, sync } from 'most-subject';
import { Object, Sink } from '../types';

export function createProxySinks<Sinks extends Object<Sink<any>>>(
  sinks: Sinks = {} as Sinks,
  disposableSubject: Subject<void> = sync<void>()): Sinks
{
  return new Proxy<Sinks>(sinks, {
    get(target: Sinks, property: string) {
      if (!target[property])
        target[property] = sync<any>();

      return target[property].until(disposableSubject);
    },

    has() {
      return true;
    },
  });
}
