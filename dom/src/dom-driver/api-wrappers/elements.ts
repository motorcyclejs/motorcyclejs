import { Stream } from 'most';
import { DomSource } from '../../types';

export function elements(domSource: DomSource): Stream<Array<Element>> {
  return domSource.elements();
}
