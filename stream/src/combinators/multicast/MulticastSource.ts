import { Disposable, Scheduler, Sink, Stream, Time } from '@most/types'
import { append, findIndex, remove } from '@most/prelude'
import { tryEnd, tryEvent } from '../../try'

import { MulticastDisposable } from './MulticastDisposable'
import { MulticastStream } from '../../types'
import { disposeNone } from '@most/disposable'

export class Multicast<A> implements MulticastStream<A> {
  public source: Stream<A>
  protected sinks: Array<Sink<A>>
  protected _disposable: Disposable

  constructor(source: Stream<A>) {
    this.source = source
    this.sinks = []
    this._disposable = disposeNone()
  }

  public run(sink: Sink<A>, scheduler: Scheduler): Disposable {
    const n = this.add(sink)

    if (n === 1)
      this._disposable = this.source.run(this, scheduler)

    return new MulticastDisposable(this, sink)
  }

  public event(time: Time, value: A) {
    const s = this.sinks

    if (s.length === 1)
      return s[0].event(time, value)

    for (let i = 0; i < s.length; ++i)
      tryEvent(time, value, s[i])
  }

  public end(time: Time) {
    const s = this.sinks

    for (let i = 0; i < s.length; ++i)
      tryEnd(time, s[i])
  }

  public error(time: Time, err: Error) {
    const s = this.sinks

    for (let i = 0; i < s.length; ++i)
      s[i].error(time, err)
  }

  protected _dispose() {
    const disposable = this._disposable
    this._disposable = disposeNone()

    disposable.dispose()
  }

  protected add(sink: Sink<A>) {
    this.sinks = append(sink, this.sinks)

    return this.sinks.length
  }

  protected remove(sink: Sink<A>) {
    const i = findIndex(sink, this.sinks)

    if (i >= 0)
      this.sinks = remove(i, this.sinks)

    return this.sinks.length
  }
}
