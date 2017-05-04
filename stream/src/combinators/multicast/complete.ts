import { HoldStream, MulticastStream } from '../../types'

import { curry2 } from '@most/prelude'
import { scheduler } from '../../scheduler'

export const complete = <A>(stream: MulticastStream<A>): MulticastStream<A> =>
  (stream.end(scheduler.now()), stream)
