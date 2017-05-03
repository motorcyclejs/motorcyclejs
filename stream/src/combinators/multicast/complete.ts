import { HoldStream, MulticastStream } from '../../types'

import { curry2 } from '@most/prelude'
import { scheduler } from '../../scheduler'

export const complete: CompleteArity2 = curry2(
  function complete<A>(value: A, stream: MulticastStream<A>): MulticastStream<A> {
    stream.end(scheduler.now(), value)

    return stream
  },
)

export interface CompleteArity2 {
  <A>(value: A, stream: MulticastStream<A>): MulticastStream<A>
  <A>(value: A, stream: HoldStream<A>): HoldStream<A>

  <A>(value: A): CompleteArity1<A>
}

export interface CompleteArity1<A> {
  (stream: MulticastStream<A>): MulticastStream<A>
  (stream: HoldStream<A>): HoldStream<A>
}
