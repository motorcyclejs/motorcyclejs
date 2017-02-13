import { Stream, combineArray, just, map, switchLatest } from 'most';

export function switchCombine<A>(streams$: Stream<Array<Stream<A>>>) {
  return switchLatest(
    map(
      streams => streams.length === 0 ? just([]) : combineArray<A, Array<A>>(Array, streams),
      streams$,
    ),
  );
}
