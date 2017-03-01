import { DomSource, events, query } from '../../../../../dom/src';
import { Stream, filter, map } from 'most';

import { todoAppStyles } from './styles';

export function newTodo(dom: DomSource): Stream<string> {
  const newItem = query(`.${todoAppStyles.newTodoClass}`, dom);

  const keyDown$ = events('keydown', newItem);

  const enterKey$ = filter(isEnterKey, keyDown$);

  const trimmedValue$ = map(trimmedValue, enterKey$);

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
