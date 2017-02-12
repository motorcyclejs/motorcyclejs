import { DomSource, events, query } from '@motorcycle/dom';
import { Stream, filter, map } from 'most';

import { todoAppStyles } from './';

export function newTodoStream(dom: DomSource): Stream<string> {
  const newItem = query(`.${todoAppStyles.newItemClass}`, dom);

  const keyDown$ = events('keydown', newItem);

  const enterKey$ = filter(isEnterKey, keyDown$);

  const filledItem$ = filter(isItemFilled, enterKey$);

  const trimmedValue$ = map(trimmedValue, filledItem$);

  return trimmedValue$;
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
