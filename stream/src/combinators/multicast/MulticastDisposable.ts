import { Disposable, Sink, Stream } from '@most/types'

import { Multicast } from './MulticastSource'

export class MulticastDisposable implements Disposable {
  private source: Stream<any> & Sink<any>
  private sink: Sink<any>
  private disposed: boolean

  constructor(source: Stream<any> & Sink<any>, sink: Sink<any>) {
    this.source = source
    this.sink = sink
    this.disposed = false
  }

  public dispose() {
    if (this.disposed)return

    this.disposed = true
    const remaining = (this.source as any).remove(this.sink)

    return remaining === 0 && (this.source as any)._dispose()
  }
}
