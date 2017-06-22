import { StandardEvents } from './Events'
import { Stream } from 'most'
import { VNode } from 'mostly-dom'

export interface EventsFnOptions {
  useCapture?: boolean
}

export interface DomSource {
  select(selector: string): DomSource
  elements<T extends Element>(): Stream<Array<T>>

  events<T extends Event>(eventType: StandardEvents, options?: EventsFnOptions): Stream<T>
  events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>

  namespace(): Array<string>
  isolateSource<T extends Element>(source: DomSource, scope: string): DomSource
  isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode>
}
