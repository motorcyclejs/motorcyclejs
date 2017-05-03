import { combineArray, just, map, switchLatest } from '@most/core'

import { Stream } from '@most/types'

// tslint:disable:unified-signatures
export function switchCombine<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<ReadonlyArray<A>>
export function switchCombine<A>(
  streams$: Stream<ReadonlyArray<Stream<A>>>): Stream<ReadonlyArray<A>>

export function switchCombine<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<ReadonlyArray<A>>
{
  return switchLatest(
    map(
      (streams) => streams.length === 0 ?
        just([]) :
        combineArray(Array, streams as Array<Stream<A>>),
      streams$,
    ),
  )
}
