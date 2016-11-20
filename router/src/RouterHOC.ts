import { Stream, of } from 'most';
import { curry2 } from '@most/prelude';
import { Component } from '@motorcycle/core';
import { hold } from 'most-subject';
import { RouterSource, DefineReturn } from './RouterSource';
import { Location, Pathname, HistoryInput } from './types';

export interface RouterDefinitions<Sources, Sinks> {
  [key: string]:
  Component<Sources, Sinks & { router: RouterInput }> |
  RouterDefinitions<Sources, Sinks>;
}

export type RouterSources<Sources> = Sources & { router: RouterSource };
export type RouterInput = Stream<HistoryInput | Pathname>;

export interface RouterHOC {
  (definitions: RouterDefinitions<any, any>, sources: RouterSources<any>): Stream<any>;

  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>,
    sources: RouterSources<Sources>): Stream<Sinks>;

  (definitions: RouterDefinitions<any, any>): (sources: RouterSources<any>) => Stream<any>;

  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>):
    (sources: RouterSources<Sources>) => Stream<Sinks>;
}

export const Router: RouterHOC = curry2<any, any, any>(function Router<Sources, Sinks>(
  definitions: RouterDefinitions<Sources, Sinks>,
  sources: RouterSources<any>,
): Stream<Sinks & { router: RouterInput }> {
  const match$: Stream<DefineReturn> =
    sources.router.define(definitions).thru(hold(1));

  return match$.filter(isNotNull).map(({ path, value }) => {
    const router: RouterSource = sources.router.path(path);
    const sinks: any = value({ ...sources, router });

    const sinks$: Stream<Sinks & { router: RouterInput }> =
      typeof (sinks as any).observe === 'function'
        ? sinks.map(augmentSinks(router))
        : of(sinks).map(augmentSinks(router));

    return sinks$ as Stream<Sinks & { router: RouterInput }>;
  })
    .switch();
});

function augmentSinks(router: RouterSource): any {
  return function (nestedSinks: any) {
    return {
      ...nestedSinks,
      router: nestedSinks.router
        .map(nestPath(router))
        .skipRepeatsWith(equalPaths),
    };
  };
}

function nestPath(router: RouterSource) {
  return function (route: HistoryInput | Pathname) {
    const previousRoute: string =
      (router as any)._previousRoutes.join('/');

    if (typeof route === 'string')
      return router.createHref(route.replace(previousRoute, ''));

    if (route.type === 'push')
      return {
        ...route,
        pathname: router.createHref(route.pathname.replace(previousRoute, '')),
      };

    if (route.type === 'replace')
      return {
        ...route,
        pathname: router.createHref(route.pathname.replace(previousRoute, '')),
      };

    return route;
  };
}

function isNotNull({path}: any) {
  return path !== null;
}

function equalPaths({path}: any, {path: path2}: any) {
  return path !== path2;
}
