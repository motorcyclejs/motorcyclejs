import { Sinks, Sources } from './types';
import { map, sampleWith } from 'most';

import { Todo } from '../../domain/model';
import { filter } from 'ramda';

export function ClearCompleted(sinks: Sinks): Sources {
  const { clearCompletedTodos$, todos$ } = sinks;

  const updatedTodos$ =
    map(clearCompleted, sampleWith(clearCompletedTodos$, todos$));

  return { todos$: updatedTodos$ };
}

function clearCompleted(todos: Array<Todo>): Array<Todo> {
  return filter(todo => !todo.completed, todos);
}
