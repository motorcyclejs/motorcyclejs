import { runEffects, tap } from '@most/core'

import { Stream } from '@most/types'
import { curry2 } from '@most/prelude'
import { scheduler } from '../scheduler'

export const drain = <A>(stream: Stream<A>) => runEffects(stream, scheduler)

export const observe: Observe =
  curry2(<A>(f: (a: A) => any, stream: Stream<A>) => drain(tap(f, stream)))

export interface Observe {
  <A>(f: (a: A) => any, stream: Stream<A>): Promise<any>
  <A>(f: (a: A) => any): (stream: Stream<A>) => Promise<any>
}
