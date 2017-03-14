export function get(object: any, key: string ): any {
  return object[key];
}

export function set<T> (object: any, key: string, value: T): any {
  object[key] = value;
  return object;
}
