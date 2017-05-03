import { Sink, Stream } from '@most/types'
import { append, curry2, drop } from '@most/prelude'

import { HoldStream } from '../types'
import { Multicast } from './multicast/MulticastSource'
import { scheduler } from '../scheduler'

export interface HoldNFn {
  <A>(bufferSize: number, stream: Stream<A>): HoldStream<A>
  <A>(bufferSize: number): (stream: Stream<A>) => HoldStream<A>
}

export const holdN: HoldNFn = curry2(
  <T>(bufferSize: number, stream: Stream<T>): HoldStream<T> => new Hold(stream, bufferSize))

export const hold = <T>(stream: Stream<T>) => holdN<T>(1, stream)

export class Hold<T> extends Multicast<T> {
  protected has: boolean = false
  protected buffer: Array<T> = []
  protected bufferSize: number

  constructor(source: Stream<T>, bufferSize: number) {
    super(source)
    this.bufferSize = bufferSize
  }

  public add(sink: Sink<T>) {
    if (this.has)
      pushEvents(this.buffer, sink)

    return super.add(sink)
  }

  public event(time: number, value: T) {
    this.has = true
    this.buffer = dropAndAppend(value, this.buffer, this.bufferSize)

    return super.event(time, value)
  }
}

function pushEvents<T>(buffer: Array<T>, sink: Sink<T>) {
  const length = buffer.length

  for (let i = 0; i < length; ++ i)
    sink.event(scheduler.now(), buffer[i])
}

function dropAndAppend<T>(value: T, buffer: Array<T>, bufferSize: number) {
  if (buffer.length === bufferSize)
    return append(value, drop(1, buffer))

  return append(value, buffer)
}
