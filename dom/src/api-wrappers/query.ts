import { DomSource } from '../types'
import { curry2 } from '@most/prelude'

export const query: QueryFn = curry2<string, DomSource, DomSource>(
  function selectWrapper(cssSelector: string, domSource: DomSource) {
    return domSource.select(cssSelector)
  },
)

export interface QueryFn {
  (cssSelector: string, domSource: DomSource): DomSource
  (cssSelector: string): (domSource: DomSource) => DomSource
}
