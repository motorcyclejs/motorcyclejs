import { Sinks, Sources } from './';
import { Todo, tryTitle } from '../../domain/model';
import { complement, concat } from 'ramda';
import { filter, map, observe, sampleWith } from 'most';

import { createTodo } from '../../domain/services';
import { notify } from '../notify';
import { sample } from '@most/sample';

export function AddTodo(sinks: Sinks): Sources {
  const { todos$, addTodo$ } = sinks;

  const validTitle$ = map(tryTitle, addTodo$);

  const canCreateTodo$ = filter(Boolean, validTitle$);

  const canNotCreateTodo$ = filter(complement(Boolean), validTitle$);

  observe(alertInvalidTitle, sampleWith(canNotCreateTodo$, addTodo$));

  const newTodo$ = map(createTodo, sampleWith(canCreateTodo$, addTodo$));

  const updatedTodos$ = sample(concatTodos, newTodo$, todos$);

  return { todos$: updatedTodos$ };
}

function concatTodos(todo: Todo, todos: Array<Todo>) {
  return concat(todos, [todo]);
}

function alertInvalidTitle(title: string)  {
  if (title.length === 0)
    return notify(`Unable to create a todo without a title.`);

  notify(`Unable to create a todo with a title longer than 80 characters.`);
}
