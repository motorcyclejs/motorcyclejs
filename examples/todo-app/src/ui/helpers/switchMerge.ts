import { Stream, just, map, mergeArray, switchLatest } from 'most'

// tslint:disable:unified-signatures
// tslint:disable:no-unused-variable
export function switchMerge<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<A>
export function switchMerge<A>(
  streams$: Stream<ReadonlyArray<Stream<A>>>): Stream<A>

export function switchMerge<A>(
  streams$: Stream<Array<Stream<A>>>): Stream<A>
{
  return switchLatest<A>(map((streams) => mergeArray(streams), streams$))
}
