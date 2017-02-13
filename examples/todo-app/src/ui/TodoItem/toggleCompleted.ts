import { DomSource, events, query } from '@motorcycle/dom';
import { Stream, scan } from 'most';

import { TodoItemStyles } from './';

export function toggleCompleted(dom: DomSource): Stream<boolean> {
  const toggle = query(`.${TodoItemStyles.toggleClass}`, dom);

  const click$ = events('click', toggle);

  const completed$ = scan(click => !click, false, click$);

  return completed$;
}
