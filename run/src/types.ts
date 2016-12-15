import { Stream } from 'most';
import { Subject } from 'most-subject';

export type Source = any;
export type Sink<T> = Stream<T>;

export type DisposableSource = { dispose?: () => void };
export type ProxySinks = Object<Subject<any>>;

export interface Object<T> {
  [key: string]: T;
}

export interface Component<Sources, Sinks> {
  (sources: Sources): Sinks;
}

export interface RunReturn<Sources, Sinks> {
  sources: Sources;
  sinks: Sinks;
  dispose: Function;
}
