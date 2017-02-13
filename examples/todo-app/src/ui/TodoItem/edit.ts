import { DomSource, events, query } from '@motorcycle/dom';
import { constant, filter, map, merge, startWith } from 'most';

import { TodoItemStyles } from './';

export function edit(dom: DomSource) {
  const label = query(`.${TodoItemStyles.labelClass}`, dom);
  const input = query(`.${TodoItemStyles.editClass}`, dom);

  const dblClick$ = events('dblclick', label);

  const keyDown$ = events('keydown', input);

  const enterKey$ = filter(isEnterKey, keyDown$);

  const editing$ =
    startWith(false, merge(
      constant(false, enterKey$),
      constant(true, dblClick$),
    ));

  const value$ = map(trimmedValue, filter(isItemFilled, keyDown$));

  return { editing$, value$ };
}

function isEnterKey(event: KeyboardEvent): boolean {
  const ENTER_KEY = 13;

  return event.keyCode === ENTER_KEY;
}

function isItemFilled(event: KeyboardEvent): boolean {
  return !!trimmedValue(event);
}

function trimmedValue(event: KeyboardEvent): string {
  return String((event.target as HTMLInputElement).value).trim();
}
