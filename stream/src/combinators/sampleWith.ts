import { Stream } from '@most/types'
import { sample } from '@most/core'

export const sampleWith: SampleWith = sample((_, x) => x) as SampleWith

export interface SampleWith {
  <A>(sampler: Stream<any>, stream: Stream<A>): Stream<A>
  (sampler: Stream<any>): <A>(stream: Stream<A>) => Stream<A>
}
