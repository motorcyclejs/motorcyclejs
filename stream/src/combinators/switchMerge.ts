import { just, map, mergeArray, switchLatest } from '@most/core'

import { Stream } from '@most/types'

// tslint:disable:unified-signatures
// tslint:disable:no-unused-variable
export function switchMerge<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<ReadonlyArray<A>>
export function switchMerge<A>(
  streams$: Stream<ReadonlyArray<Stream<A>>>): Stream<ReadonlyArray<A>>

export function switchMerge<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<ReadonlyArray<A>>
{
  return switchLatest<ReadonlyArray<A>>(
    map(
      (streams) => streams.length === 0 ? just([]) : mergeArray(streams),
      streams$,
    ),
  )
}
