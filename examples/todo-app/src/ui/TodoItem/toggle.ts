import { DomSource, events, query } from '@motorcycle/dom';
import { Stream, scan } from 'most';

import { TodoItemStyles } from './';

export function toggle(dom: DomSource): Stream<boolean> {
  const toggle = query(`.${TodoItemStyles.toggleClass}`, dom);

  const click$ = events('click', toggle);

  const toggle$ = scan(click => !click, false, click$);

  return toggle$;
}
