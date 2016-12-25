import { Object } from './types';

export function get <T, K extends keyof T>(object: T, key: K): T[K] {
  return object[key];
}

export function set<T> (object: Object<T>, key: string, value: T): Object<T> {
  object[key] = value;
  return object;
}
