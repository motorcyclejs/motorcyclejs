import { Sinks, Sources, newTodoStream, view } from './';
import { Stream, combineArray, just, map, switchLatest } from 'most';
import { TodoItem, Sinks as TodoItemSinks } from '../TodoItem';
import { mapProp, switchCombine } from '../helpers';

import { Todo } from '../../domain/model/Todo';
import { VNode } from '@motorcycle/dom';
import { addTodoService } from '../../application';
import { map as rMap } from 'ramda';

export function TodoApp(sources: Sources): Sinks {
  const { dom, todos$ } = sources;

  const title$ = newTodoStream(dom);

  const add$ = map(addTodoService, title$);

  const todoItemSinksList$ =
    map(
      (todos: Array<Todo>) => {
        const toTodoItemViewStream =
          (todo: Todo) => TodoItem({ dom, todo$: just(todo) });

        return rMap(toTodoItemViewStream, todos);
      },
      todos$,
    );

  const todoItemView$s$ =
    map(
      todoItemSinksList => mapProp<TodoItemSinks, Stream<VNode>>(`view$`, todoItemSinksList),
      todoItemSinksList$,
    );

  const todoItemSave$s$ =
    map(
      todoItemSinksList => mapProp<TodoItemSinks, Stream<Todo>>(`save$`, todoItemSinksList),
      todoItemSinksList$,
    );

  const todoItemViews$ = switchCombine<VNode>(todoItemView$s$);

  const saveAll$ = switchCombine<Todo>(todoItemSave$s$);

  const view$ = map(view, todoItemViews$);

  return { view$, add$, saveAll$ };
}
