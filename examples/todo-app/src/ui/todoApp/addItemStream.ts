import { DomSource, events, query } from '@motorcycle/dom';
import { Stream, filter, map, multicast } from 'most';

import { todoAppStyles } from './';

export function addItemStream(dom: DomSource): Stream<string> {
  const newItemInput = query(`.${todoAppStyles.newItem}`, dom);

  const keyDown$ = events('keydown', newItemInput);

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
