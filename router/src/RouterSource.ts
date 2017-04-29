import { Location, Path, RouteDefinitions } from './types'
import { getFilteredPath, isStrictlyInScope, pathJoin, splitPath } from './helpers'

import { Stream } from 'most'
import { hold } from 'most-subject'
import { default as switchPath } from 'switch-path'

export class RouterSource {
  private _history$: Stream<Location>
  private _previousRoutes: Array<Path>

  constructor(history$: Stream<Location>, previousRoutes: Array<Path>) {
    this._history$ = history$
    this._previousRoutes = previousRoutes
  }

  public history(): Stream<Location> {
    return this._history$
  }

  public path(path: Path): RouterSource {
    const scopedNamespace: Array<Path> =
      this._previousRoutes.concat(splitPath(path))

    const scopedHistory$: Stream<Location> =
      this._history$.filter(isStrictlyInScope(scopedNamespace)).thru(hold(1))

    return new RouterSource(scopedHistory$, scopedNamespace)
  }

  public define(routes: RouteDefinitions): Stream<DefineReturn> {
    const previousRoutes = this._previousRoutes
    const createHref = this.createHref.bind(this)

    return this._history$
      .map(function matchRoute(location: Location) {
        const filteredPath = getFilteredPath(previousRoutes, location.path)

        return { ...switchPath(filteredPath, routes), location, createHref }
      })
      .thru(hold(1))
  }

  public createHref(path: Path): Path {
    const previousRoutes = this._previousRoutes

    if (previousRoutes.length === 0)
      return pathJoin(['/', path])

    return pathJoin(['/', ...previousRoutes, path])
  }
}

export interface DefineReturn {
  location: Location
  createHref: (path: Path) => Path
  path: string | null
  value: any | null
}
