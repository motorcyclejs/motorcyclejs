import { DomSinks, DomSources } from '@motorcycle/dom';

import { Component } from '@motorcycle/run';

export function isolateDom<Sources extends DomSources, Sinks extends DomSinks>(
  ComponentFn: Component<Sources, Sinks>,
) {
  return function (sources: Sources): Sinks {
    const { dom } = sources;
    const key = createKey();

    const isolatedDom = dom.isolateSource(dom, key);

    const sinks = ComponentFn({ ...sources as any, dom: isolatedDom});

    return { ...sinks as any, view$: dom.isolateSink(sinks.view$, key) };
  };
}
export function createKey(): string {
  return Math.random().toString(36).substr(2, 6);
}
