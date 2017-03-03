import { Title, Todo } from '../model';

import { createUid } from './createUid';

export function createTodo(title: Title): Todo {
  return {
    id: createUid(),
    completed: false,
    title,
  };
}
