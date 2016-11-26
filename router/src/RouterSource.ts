import { Stream } from 'most';
import { hold } from 'most-subject';
import switchPath from 'switch-path';

import { Location, Pathname, RouteDefinitions } from './types';
import { splitPath, pathJoin, isStrictlyInScope, getFilteredPath } from './helpers';

export class RouterSource {
  constructor(
    private _history$: Stream<Location>,
    private _previousRoutes: Pathname[]) { }

  public history(): Stream<Location> {
    return this._history$;
  }

  public path(pathname: Pathname): RouterSource {
    const scopedNamespace: Pathname[] =
      this._previousRoutes.concat(splitPath(pathname));

    const scopedHistory$: Stream<Location> =
      this._history$.filter(isStrictlyInScope(scopedNamespace)).thru(hold(1));

    return new RouterSource(scopedHistory$, scopedNamespace);
  }

  public define(routes: RouteDefinitions): Stream<DefineReturn> {
    const previousRoutes = this._previousRoutes;
    const createHref = this.createHref.bind(this);

    return this._history$
      .map(function matchRoute(location: Location) {
        const filteredPath = getFilteredPath(previousRoutes, location.pathname);
        return { ...switchPath(filteredPath, routes), location, createHref };
      })
      .thru(hold(1));
  }

  public createHref(path: Pathname): Pathname {
    const previousRoutes = this._previousRoutes;

    if (previousRoutes.length === 0)
      return pathJoin(['/', path]);

    return pathJoin(['/', ...previousRoutes, path]);
  }
}

export interface DefineReturn {
  location: Location;
  createHref: (path: Pathname) => Pathname;
  path: string | null;
  value: any | null;
}
