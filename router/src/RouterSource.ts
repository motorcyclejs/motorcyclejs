import { Stream } from 'most';
import { hold } from 'most-subject';
import switchPath from 'switch-path';

import { Location, Pathname, RouteDefinitions } from './types';
import { splitPath, pathJoin, isStrictlyInScope, getFilteredPath } from './helpers';

export class RouterSource {
  constructor(
    private _history$: Stream<Location>,
    private _namespace: Pathname[]) { }

  public history(): Stream<Location> {
    return this._history$;
  }

  public path(pathname: Pathname): RouterSource {
    const scopedNamespace: Pathname[] =
      this._namespace.concat(splitPath(pathname));

    const scopedHistory$: Stream<Location> =
      this._history$.filter(isStrictlyInScope(scopedNamespace)).thru(hold(1));

    return new RouterSource(scopedHistory$, scopedNamespace);
  }

  public define(routes: RouteDefinitions): Stream<DefineReturn> {
    const namespace = this._namespace;
    const createHref = this.createHref.bind(this);

    return this._history$
      .map(function matchRoute(location: Location) {
        const filteredPath = getFilteredPath(namespace, location.pathname);
        const { path, value } = switchPath(filteredPath, routes);
        return { path, value, location, createHref };
      })
      .thru(hold(1));
  }

  public createHref(path: Pathname): Pathname {
    return '/' + pathJoin(this._namespace.concat(path));
  }
}

export interface DefineReturn {
  location: Location;
  createHref: (path: Pathname) => Pathname;
  path: string | null;
  value: any | null;
}
