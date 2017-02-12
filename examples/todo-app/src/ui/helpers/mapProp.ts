import { map, prop } from 'ramda';

export function mapProp<A, B>(property: string, objs: Array<A>): Array<B> {
  return map(obj => prop<B>(property, obj), objs);
}
