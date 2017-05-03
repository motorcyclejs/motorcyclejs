import { Disposable, Scheduler, Sink, Stream } from '@most/types'

import { Multicast } from '../combinators/multicast/MulticastSource'
import { MulticastDisposable } from '../combinators/multicast/MulticastDisposable'
import { never } from '@most/core'
import { scheduler } from '../scheduler'

export interface Proxy<T> {
  stream: Stream<T>
  // tslint:disable-next-line:no-mixed-interface
  attach(stream: Stream<T>): Stream<T>
}

export function proxy<T>(): Proxy<T> {
  const stream = new ProxySource<T>()

  const attach = (original: Stream<T>) => stream.attach(original)

  return { attach, stream }
}

export class ProxySource<T> extends Multicast<T> {
  private attached: boolean = false
  private running: boolean = false

  constructor() {
    super(never())
  }

  public run(sink: Sink<T>, scheduler: Scheduler): Disposable {
    this.add(sink)

    if (this.attached && !this.running) {
      this.running = true
      this._disposable = this.source.run(this, scheduler)

      return this._disposable
    }

    return new MulticastDisposable(this, sink)
  }

  public attach(source: Stream<T>) {
    if (this.attached) throw new Error('Can only proxy 1 stream')
    this.attached = true

    if (this.sinks.length)
      this._disposable = source.run(this, scheduler)
    else
      this.source = source

    return source
  }

  public end(time: number, value: T) {
    this.attached = false
    this.running = false

    return super.end(time, value)
  }
}
