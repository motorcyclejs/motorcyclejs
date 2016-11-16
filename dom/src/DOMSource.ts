import { Stream } from 'most';
import { VNode } from './interfaces';

export interface EventsFnOptions {
  useCapture?: boolean;
}

export interface DOMSource {
  select(selector: string): DOMSource;
  elements<T extends Element>(): Stream<Array<T>>;
  events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>;

  isolateSource(source: DOMSource, scope: string): DOMSource;
  isolateSink (sink: Stream<VNode>, scope: string): Stream<VNode>
}