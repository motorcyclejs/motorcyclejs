import { Subscription } from 'most';
import { sync } from 'most-subject';
import { Component, Object, Sink, ProxySinks, RunReturn } from './types';
import { createProxySinks, replicateSinks, createDisposableSinks } from './sinks';
import { createDispose } from './dispose';

export function run(
  main: Component<any, any>,
  effects: Component<any, any>): RunReturn<any, any>;

export function run<Sources extends Object<any>, Sinks extends Object<Sink<any>>>(
  main: Component<Sources, Sinks>,
  effects: Component<Sinks, Sources>): RunReturn<Sources, Sinks>;

export function run<Sources extends Object<any>, Sinks extends Object<Sink<any>>>(
  main: Component<Sources, Sinks>,
  effects: Component<Sinks, Sources>): RunReturn<Sources, Sinks>
{
  const disposableSubject = sync<void>();
  const sinkProxies: Sinks = {} as Sinks;
  const proxySinks: Sinks = createProxySinks<Sinks>(sinkProxies, disposableSubject);
  const sources: Sources = effects(proxySinks);
  const sinks: Sinks = createDisposableSinks(main(sources), disposableSubject);
  const subscriptions: Array<Subscription<any>> = replicateSinks(sinks, sinkProxies);

  const dispose: Function =
    createDispose(disposableSubject, sources, subscriptions);

  return { sources, sinks, dispose };
}
