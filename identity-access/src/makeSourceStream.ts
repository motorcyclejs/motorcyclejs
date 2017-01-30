import { Stream, combineArray, fromPromise, map, switchLatest } from 'most';

import { UserRepository } from './';

export function makeSourceStream<A, B>(
  fn: (userRepository: UserRepository, x: A) => Promise<B>,
  userRepository$: Stream<UserRepository>,
  x$: Stream<A>): Stream<B>
{
  const sourcePromise$: Stream<Promise<B>> =
    combineArray(fn, [
      userRepository$,
      x$,
    ]);

  const source$: Stream<B> =
    switchLatest(map<Promise<B>, Stream<B>>(fromPromise, sourcePromise$));

  return source$;
}
