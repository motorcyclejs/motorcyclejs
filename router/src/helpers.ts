import { Path, Location } from '@motorcycle/history';

export function isStrictlyInScope(namespace: Path[]) {
  return function (location: Location): boolean {
    const pathParts = splitPath(location.path);
    return namespace.every((v, i) => pathParts[i] === v);
  };
}

export function getFilteredPath(namespace: Path[], path: Path): Path {
  return '/' + filterPath(splitPath(path), namespace);
}

export function getUnfilteredPath(namespace: Path[], path: Path): Path {
  return path.replace(getFilteredPath(namespace, path), '');
};

export function newLocation(location: Location, pathname: Path): Location {
  const l: any = {};

  const keys: Array<keyof Location> =
    Object.keys(location) as Array<keyof Location>;

  for (let i = 0; i < keys.length; ++i) {
    l[keys[i]] = location[keys[i]];
  }

  l.pathname = pathname;

  return l;
}

export function splitPath(path: Path): Path[] {
  return path.split('/').filter(p => p.length > 0);
}

export function filterPath(pathParts: Path[], namespace: Path[]): Path {
  return pathParts.filter(part => namespace.indexOf(part) < 0).join('/');
}

export function pathJoin(parts: Path[]): Path {
   const replace = new RegExp('/{1,}', 'g');
   return parts.join('/').replace(replace, '/');
}
