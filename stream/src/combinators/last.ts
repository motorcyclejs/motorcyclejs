import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'

export const last = <A>(stream: Stream<A>): Stream<A> => new Last<A>(stream)

class Last<A> implements Stream<A> {
  private source: Stream<A>

  constructor(source: Stream<A>) {
    this.source = source
  }

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    return this.source.run(new LastSink<A>(sink), scheduler)
  }
}

class LastSink<A> implements Sink<A> {
  private sink: Sink<A>
  private has: boolean
  private value: A | void

  constructor(sink: Sink<A>) {
    this.sink = sink
    this.has = false
    this.value = void 0
  }

  public event(t: Time, x: A) {
    Function.prototype(t)
    this.has = true
    this.value = x
  }

  public error(t: Time, e: Error) {
    this.sink.error(t, e)
  }

  public end(t: Time) {
    if (this.has)
      this.sink.event(t, this.value as A)

    this.sink.end(t)
  }
}
