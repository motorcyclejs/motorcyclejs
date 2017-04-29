import { DomSource } from '../types'
import { Stream } from 'most'

export function elements<T extends Element>(domSource: DomSource): Stream<Array<T>> {
  return domSource.elements<T>()
}
