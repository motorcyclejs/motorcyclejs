import { Stream, map, mergeArray, switchLatest } from 'most';

export function switchMerge<A>(streams$: Stream<Array<Stream<A>>>): Stream<A> {
  return switchLatest(
    map(
      streams => mergeArray(streams),
      streams$,
    ),
  );
}
