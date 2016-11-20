import { Pathname, Location } from '@motorcycle/history';

export function isStrictlyInScope(namespace: Pathname[]) {
  return function (location: Location): boolean {
    const pathParts = splitPath(location.pathname);
    return namespace.every((v, i) => pathParts[i] === v);
  };
}

export function getFilteredPath(namespace: Pathname[], path: Pathname): Pathname {
  return '/' + filterPath(splitPath(path), namespace);
}

export function getUnfilteredPath(namespace: Pathname[], path: Pathname): Pathname {
  return path.replace(getFilteredPath(namespace, path), '');
};

export function newLocation(location: Location, pathname: Pathname): Location {
  const l: any = {};

  const keys: Array<keyof Location> =
    Object.keys(location) as Array<keyof Location>;

  for (let i = 0; i < keys.length; ++i) {
    l[keys[i]] = location[keys[i]];
  }

  l.pathname = pathname;

  return l;
}

export function splitPath(path: Pathname): Pathname[] {
  return path.split('/').filter(p => p.length > 0);
}

export function filterPath(pathParts: Pathname[], namespace: Pathname[]): Pathname {
  return pathParts.filter(part => namespace.indexOf(part) < 0).join('/');
}

export function pathJoin(parts: Pathname[]): Pathname {
   const replace = new RegExp('/{1,}', 'g');
   return parts.join('/').replace(replace, '/');
}
