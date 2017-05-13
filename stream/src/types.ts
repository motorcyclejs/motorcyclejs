import { Sink, Stream } from '@most/types'

export interface MulticastStream<A> extends Stream<A>, Sink<A> {}
export interface HoldStream<A> extends MulticastStream<A> {}
