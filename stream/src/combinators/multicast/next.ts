import { HoldStream, MulticastStream } from '../../types'

import { curry2 } from '@most/prelude'
import { scheduler } from '../../scheduler'

export const next: NextArity2 = curry2(
  function next<A>(value: A, stream: MulticastStream<A>): MulticastStream<A> {
    stream.event(scheduler.now(), value)

    return stream
  },
)

export interface NextArity2 {
  <A>(value: A, stream: MulticastStream<A>): MulticastStream<A>
  <A>(value: A, stream: HoldStream<A>): HoldStream<A>

  <A>(value: A): NextArity1<A>
}

export interface NextArity1<A> {
  (stream: MulticastStream<A>): MulticastStream<A>
  (stream: HoldStream<A>): HoldStream<A>
}
