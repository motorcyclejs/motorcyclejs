import { Sink, Time } from '@most/types'

export function tryEvent<A>(t: Time, x: A, sink: Sink<A>) {
  try {
    sink.event(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}

export function tryEnd<A>(t: Time, x: A, sink: Sink<A>) {
  try {
    sink.end(t, x)
  } catch (e) {
    sink.error(t, e)
  }
}
