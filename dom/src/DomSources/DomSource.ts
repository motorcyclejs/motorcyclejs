import { Stream } from 'most';
import { VNode } from 'snabbdom-ts';

export interface EventsFnOptions {
  useCapture?: boolean;
}

export interface DomSource {
  select(selector: string): DomSource;
  elements<T extends Element>(): Stream<Array<T>>;
  events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>;

  isolateSource(source: DomSource, scope: string): DomSource;
  isolateSink (sink: Stream<VNode>, scope: string): Stream<VNode>
}