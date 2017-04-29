import { Subject, sync } from 'most-subject'
import { get, set } from '../helpers'

export function createDisposableSinks<Sinks>(
  sinks: Sinks = {} as Sinks,
  disposableSubject: Subject<void> = sync<void>()): Sinks
{
  return Object.keys(sinks).reduce<Sinks>(
    function createDisposableSink(disposableSinks: Sinks, sinkName: keyof Sinks): Sinks {
      const disposableSink =
        get(sinks, sinkName).until(disposableSubject)

      return set<Subject<any>>(disposableSinks, sinkName, disposableSink) as Sinks
    },
    {} as Sinks,
  )
}
