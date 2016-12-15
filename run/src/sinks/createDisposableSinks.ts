import { Subject, sync } from 'most-subject';
import { Object, Sink } from '../types';
import { get, set } from '../helpers';

export function createDisposableSinks<Sinks extends Object<Sink<any>>>(
  sinks: Sinks = {} as Sinks,
  disposableSubject: Subject<void> = sync<void>()): Sinks
{
  return Object.keys(sinks)
    .reduce<Sinks>(function createDisposableSink (disposableSinks: Sinks, sinkName: string): Sinks {
      const disposableSink: Sink<any> =
        get<Sinks, string>(sinks, sinkName).until(disposableSubject);

      return set<Sink<any>>(disposableSinks, sinkName, disposableSink) as Sinks;
    }, {} as Sinks);
}
