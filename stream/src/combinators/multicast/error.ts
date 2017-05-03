import { HoldStream, MulticastStream } from '../../types'

import { curry2 } from '@most/prelude'
import { scheduler } from '../../scheduler'

export const error: ErrorArity2 = curry2(
  function error<A>(err: Error, stream: MulticastStream<A>): MulticastStream<A> {
    stream.error(scheduler.now(), err)

    return stream
  },
)

export interface ErrorArity2 {
  <A>(value: A, stream: MulticastStream<A>): MulticastStream<A>
  <A>(value: A, stream: HoldStream<A>): HoldStream<A>

  <A>(value: A): ErrorArity1<A>
}

export interface ErrorArity1<A> {
  (stream: MulticastStream<A>): MulticastStream<A>
  (stream: HoldStream<A>): HoldStream<A>
}
