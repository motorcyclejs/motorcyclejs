import { Stream, map } from 'most'
import { curry2, prop, map as rMap } from '167'

export const mapProp: MapPropArity2 = curry2(
  function mapProp<A>(key: keyof A, stream: Stream<Array<A>>): Stream<ReadonlyArray<A[typeof key]>>
  {
    return map((list) => list.map((obj: A) => obj[key]) as ReadonlyArray<A[typeof key]>, stream)
  },
)

// tslint:disable:unified-signatures
// tslint:disable:readonly-interface
export interface MapPropArity2 {
  <A>(key: keyof A, stream: Stream<ReadonlyArray<A>>): Stream<ReadonlyArray<A[typeof key]>>
  <A>(key: keyof A, stream: Stream<ArrayLike<A>>): Stream<ReadonlyArray<A[typeof key]>>
  <A>(key: keyof A, stream: Stream<Array<A>>): Stream<ReadonlyArray<A[typeof key]>>

  <A>(key: keyof A): MapPropArity1<A, typeof key>
}

export interface MapPropArity1<A, K extends keyof A> {
  (stream: Stream<ReadonlyArray<A>>): Stream<ReadonlyArray<A[K]>>
  (stream: Stream<ArrayLike<A>>): Stream<ReadonlyArray<A[K]>>
  (stream: Stream<Array<A>>): Stream<ReadonlyArray<A[K]>>
}
