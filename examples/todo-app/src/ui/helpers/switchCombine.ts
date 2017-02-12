import { Stream, combineArray, map, switchLatest } from 'most';

export function switchCombine<A>(streams$: Stream<Array<Stream<A>>>) {
  return switchLatest(
    map(
      streams => combineArray<A, Array<A>>(Array, streams),
      streams$,
    ),
  );
}
