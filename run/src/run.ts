import { Component, RunReturn } from './types';
import { createDisposableSinks, createProxySinks, replicateSinks } from './sinks';

import { Subscription } from 'most';
import { createDispose } from './dispose';
import { sync } from 'most-subject';

export function run<Sources, Sinks>(
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
