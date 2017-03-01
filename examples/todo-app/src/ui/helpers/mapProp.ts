import { Stream, map } from 'most';
import { prop, map as rMap } from 'ramda';

export function mapProp<A, B>(
  property: keyof A,
  objs$: Stream<Array<A>>): Stream<Array<Stream<B>>>
{
  return map(rMap(obj => prop<Stream<B>>(property, obj)), objs$);
}
