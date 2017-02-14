import { DomSource, events, query } from '@motorcycle/dom';
import { constant, filter, map, merge, startWith } from 'most';

import { TodoItemStyles } from './';

export function edit(dom: DomSource) {
  const label = query(`.${TodoItemStyles.labelClass}`, dom);
  const input = query(`.${TodoItemStyles.editClass}`, dom);

  const blur$ = events('blur', input);
  const dblClick$ = events('dblclick', label);

  const keyDown$ = events('keydown', input);

  const enterKey$ =
    map(
      event => { event.preventDefault(); return event; },
      filter(isEnterKey, keyDown$)
    );

  const editing$ =
    startWith(false, merge(
      constant(false, enterKey$),
      constant(true, dblClick$),
      constant(false, blur$),
    ));

  const value$ =
    map(trimmedValue, filter(isItemFilled, merge(enterKey$, blur$)));

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
