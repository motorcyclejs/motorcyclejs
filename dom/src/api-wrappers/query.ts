import { DomSource } from '../types'
import { curry2 } from '@most/prelude'

export const query: QueryFn = curry2<string, DomSource, DomSource>(
  function selectWrapper(cssSelector: string, domSource: DomSource) {
    return domSource.select(cssSelector)
  },
)

export interface QueryFn {
  <T extends Element = Element>(cssSelector: string, domSource: DomSource): DomSource<T>
  <T extends Element = Element>(cssSelector: string): (domSource: DomSource) => DomSource<T>
}
