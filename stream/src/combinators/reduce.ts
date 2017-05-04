import { Stream } from '@most/types'
import { curry3 } from '@most/prelude'
import { last } from './last'
import { observe } from './observe'
import { scan } from '@most/core'

export const reduce: ReduceArity3 = curry3(function reduce<A, B>(
  f: (accumulator: B, value: A) => B,
  seed: B,
  stream: Stream<A>): Promise<B>
{
  return new Promise<B>((resolve, reject) =>
    observe(resolve, last(scan(f, seed, stream))).catch(reject),
  )
})

export interface ReduceArity3 {
  // tslint:disable-next-line
  <A, B>(f: (accumulator: B, value: A) => B, seed: B, stream: Stream<A>): Promise<B>
  // tslint:disable-next-line
  <A, B>(f: (accumulator: B, value: A) => B, seed: B): ReduceArity1<A, B>
  // tslint:disable-next-line
  <A, B>(f: (accumulator: B, value: A) => B): ReduceArity2<A, B>
}

export interface ReduceArity2<A, B> {
  // tslint:disable-next-line
  (seed: B, stream: Stream<A>): Promise<B>
  // tslint:disable-next-line
  (seed: B): ReduceArity1<A, B>
}

export interface ReduceArity1<A, B> {
  // tslint:disable-next-line
  (stream: Stream<A>): Promise<B>
}
