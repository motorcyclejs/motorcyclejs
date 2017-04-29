import { DefineReturn, Location, Path, RouteDefinitions, RouterSource } from './'

import { Stream } from 'most'
import { curry2 } from '@most/prelude'

export function history(routerSource: RouterSource): Stream<Location> {
  return routerSource.history()
}

export const path: PathFn = curry2(
  function path(route: Path, routerSource: RouterSource): RouterSource {
    return routerSource.path(route)
  })

export interface PathFn {
  (path: Path, routerSource: RouterSource): RouterSource
  (path: Path): (routerSource: RouterSource) => RouterSource
}

export const define: DefineFn = curry2(function define(
  routes: RouteDefinitions,
  routerSource: RouterSource): Stream<DefineReturn>
{
  return routerSource.define(routes)
})

export interface DefineFn {
  (routes: RouteDefinitions, routerSource: RouterSource): Stream<DefineReturn>
  (router: RouteDefinitions): (routerSource: RouterSource) => Stream<DefineReturn>
}

export const createHref: CreateHrefFn = curry2(
  function createHref(route: Path, routerSource: RouterSource): Path {
    return routerSource.createHref(route)
  },
)

export interface CreateHrefFn {
  (path: Path, routerSource: RouterSource): Path
  (path: Path): (routerSource: RouterSource) => Path
}
