import { Subject, sync } from 'most-subject'
import { get, set } from '../helpers'

export function createProxySinks<Sinks extends object>(
  sinks: Sinks = {} as Sinks,
  disposableSubject: Subject<void> = sync<void>()): Sinks
{
  return new Proxy<Sinks>(sinks, {
    get(target: Sinks, property: string) {
      if (!get(target, property))
        set(target, property, sync<any>())

      return get(target, property).until(disposableSubject)
    },

    has() {
      return true
    },
  })
}
