import { Component, EffectfulComponent, Object, RunReturn, Sink } from './types';
import { createDisposableSinks, createProxySinks, replicateSinks } from './sinks';

import { Subscription } from 'most';
import { createDispose } from './dispose';
import { sync } from 'most-subject';

export function run<Sources extends Object<object>, Sinks extends Object<Sink<any>>>(
  main: Component<Sources, Sinks>,
  effects: EffectfulComponent<Sinks, Sources>): RunReturn<Sources, Sinks>
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
