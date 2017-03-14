import { DomSinks, DomSource, DomSources } from './';

import { Component } from '@motorcycle/run';

export function isolateDom<Sources extends DomSources, Sinks extends DomSinks>(
  ComponentFn: Component<Sources, Sinks>): Component<Sources, Sinks>
{
  return function (sources: Sources): Sinks {
    const { dom } = sources;

    const key: string = createKey();

    const isolatedDom: DomSource = dom.isolateSource(dom, key);

    const sinks: Sinks =
      ComponentFn(Object.assign({}, sources, { dom: isolatedDom }));

    return Object.assign({}, sinks, { dom: dom.isolateSink(sinks.view$, key) });
  };
}

export function createKey(): string {
  return Math.random().toString(36).substr(2, 6);
}
