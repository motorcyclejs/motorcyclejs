import { DomSource, events, query } from '../../../../../dom/src';
import { Stream, scan, skip } from 'most';

import { TodoItemStyles } from './styles';
import { not } from 'ramda';

export function toggleCompleted(dom: DomSource): Stream<boolean> {
  const toggle = query(`.${TodoItemStyles.toggleClass}`, dom);

  const click$ = events('click', toggle);

  const completed$ = skip(1, scan(not, false, click$));

  return completed$;
}
