import { DomSource } from '../../types';
import { curry2, CurriedFunction2 } from '@most/prelude';

export const query = curry2<string, DomSource, DomSource>(
  function selectWrapper(cssSelector: string, domSource: DomSource) {
    return domSource.select(cssSelector);
  },
);
