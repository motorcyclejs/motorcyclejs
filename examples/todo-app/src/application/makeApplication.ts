import { ApplicationSinks, ApplicationSources, Infrastructure } from './types';
import { Stream, map } from 'most';
import { filter, length } from 'ramda';

import { AddTodo } from './AddTodo';
import { ClearCompleted } from './ClearCompleted';
import { FilterTodos } from './FilterTodos';
import { RemoveTodo } from './RemoveTodo';
import { Todo } from '../domain/model';
import { UpdateTodo } from './UpdateTodo';
import { mergeObjects } from './mergeObjects';
import { proxy } from 'most-proxy';

export function makeApplication(infrastructure: Infrastructure) {
  const { TodoRepository } = infrastructure;

  return function Application(sinks: ApplicationSinks): ApplicationSources {
    const {
      addTodo$,
      clearCompletedTodos$,
      updateTodo$,
      showActiveTodos$,
      showAllTodos$,
      showCompletedTodos$,
      removeTodo$,
    } = sinks;

    const { attach, stream: proxyTodos$ } = proxy<Array<Todo>>();

    showActiveTodos$.observe(x => console.log(`showActiveTodos$ ${x}`));
    showCompletedTodos$.observe(x => console.log(`showCompletedTodos$ ${x}`));
    showAllTodos$.observe(x => console.log(`showAllTodos$ ${x}`));

    const { todos$ } = TodoRepository(mergeObjects(
      AddTodo({ addTodo$, todos$: proxyTodos$ }),
      RemoveTodo({ removeTodo$, todos$: proxyTodos$ }),
      UpdateTodo({ updateTodo$, todos$: proxyTodos$ }),
      ClearCompleted({ clearCompletedTodos$, todos$: proxyTodos$ }),
    ));

    attach(todos$);

    return {
      ...FilterTodos({ todos$, showActiveTodos$, showAllTodos$, showCompletedTodos$ }),
      ...itemCounts(todos$),
    };
  };
}

function itemCounts(todos$: Stream<Array<Todo>>) {
  const activeTodoItemCount$ =
    map(length, map(filter<Todo>(todo => !todo.completed), todos$));

  const completedTodoItemCount$ =
    map(length, map(filter<Todo>(todo => todo.completed), todos$));

  const todoItemCount$ = map(length, todos$);

  return {
    activeTodoItemCount$,
    completedTodoItemCount$,
    todoItemCount$,
  };
}
