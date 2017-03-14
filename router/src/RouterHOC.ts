import { DefineReturn, RouterSource } from './RouterSource';
import { Stream, never, of } from 'most';

import { Component } from '@motorcycle/run';
import { RouterInput } from './types';
import { curry2 } from '@most/prelude';
import { hold } from 'most-subject';

export interface RouterDefinitions<Sources, Sinks> {
  [key: string]:
  Component<Sources, Sinks & { router: RouterInput }> |
  RouterDefinitions<Sources, Sinks>;
}

export type RouterComponentSources<Sources> =
  Sources & { router: RouterSource };

export interface RouterHOC {
  (definitions: RouterDefinitions<any, any>, sources: RouterComponentSources<any>): Stream<any>;

  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>,
    sources: RouterComponentSources<Sources>): Stream<Sinks>;

  (definitions: RouterDefinitions<any, any>): (sources: RouterComponentSources<any>) => Stream<any>;

  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>):
    (sources: RouterComponentSources<Sources>) => Stream<Sinks>;
}

export const RouterComponent: RouterHOC = curry2<any, any, any>(
  function Router<Sources, Sinks>(
    definitions: RouterDefinitions<Sources, Sinks>,
    sources: RouterComponentSources<any>,
  ): Stream<Sinks & { router: RouterInput }> {
    const match$: Stream<DefineReturn> =
      sources.router.define(definitions).thru(hold(1));

    return match$.filter(isNotNull).map(({ path, value }) => {
      const router: RouterSource = sources.router.path(path);
      const sinks: any = value({ ...sources, router });

      const sinks$: Stream<Sinks & { router: RouterInput }> =
        typeof (sinks as any).observe === 'function'
          ? sinks.map(augmentSinks)
          : of(sinks).map(augmentSinks);

      return sinks$ as Stream<Sinks & { router: RouterInput }>;
    })
      .switch();
  });

function augmentSinks(nestedSinks: any) {
  return {
    ...nestedSinks,
    router: (nestedSinks.router || never()).skipRepeatsWith(equalPaths),
  };
};

function isNotNull({ path }: any) {
  return path !== null;
}

function equalPaths({ path }: any, { path: path2 }: any) {
  return path !== path2;
}
