import { Location, Path } from '@motorcycle/history'

export function isStrictlyInScope(namespace: Array<Path>) {
  return function(location: Location): boolean {
    const pathParts = splitPath(location.path)

    return namespace.every((v, i) => pathParts[i] === v)
  }
}

export function getFilteredPath(namespace: Array<Path>, path: Path): Path {
  return '/' + filterPath(splitPath(path), namespace)
}

export function getUnfilteredPath(namespace: Array<Path>, path: Path): Path {
  return path.replace(getFilteredPath(namespace, path), '')
}

export function newLocation(location: Location, pathname: Path): Location {
  const l: any = {}

  const keys: Array<keyof Location> =
    Object.keys(location) as Array<keyof Location>

  for (let i = 0; i < keys.length; ++i) {
    l[keys[i]] = location[keys[i]]
  }

  l.pathname = pathname

  return l
}

export function splitPath(path: Path): Array<Path> {
  return path.split('/').filter((p) => p.length > 0)
}

export function filterPath(pathParts: Array<Path>, namespace: Array<Path>): Path {
  return pathParts.filter((part) => namespace.indexOf(part) < 0).join('/')
}

export function pathJoin(parts: Array<Path>): Path {
  const replace = new RegExp('/{1,}', 'g')

  return parts.join('/').replace(replace, '/')
}
