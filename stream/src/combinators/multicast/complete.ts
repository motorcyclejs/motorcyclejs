import { HoldStream, MulticastStream } from '../../types'

import { scheduler } from '../../scheduler'

// tslint:disable-next-line
export function complete<A>(stream: MulticastStream<A>): MulticastStream<A>
// tslint:disable-next-line
export function complete<A>(stream: HoldStream<A>): HoldStream<A>

export function complete<A>(stream: MulticastStream<A>): MulticastStream<A> {
  stream.end(scheduler.now())

  return stream
}
