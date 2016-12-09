import { SCOPE_PREFIX } from './common';

export function generateSelector(namespace: Array<string>): string {
  return namespace.filter(findSelector).join(' ');
}

function findSelector(selector: string) {
  return !selector.startsWith(SCOPE_PREFIX);
}

export function generateScope(namespace: Array<string>) {
  const scopes = namespace.filter(findScope);

  return scopes[scopes.length - 1];
}

function findScope(selector: string): boolean {
  return selector.startsWith(SCOPE_PREFIX);
}