import { Model, Sinks, Sources, newTodo, view } from './';
import { Stream, just, map, never, startWith, switchLatest } from 'most';
import { TodoItem, Sinks as TodoItemSinks } from '../TodoItem';
import { mapProp, switchCombine, switchMerge } from '../helpers';
import { filter as rFilter, map as rMap, prop as rProp } from 'ramda';

import { DefineReturn } from '@motorcycle/router';
import { Todo } from '../../domain/model/Todo';
import { VNode } from '@motorcycle/dom';
import { addTodoService } from '../../application';
import { combineObj } from 'most-combineobj';
import { hold } from '@most/hold';

export function TodoApp(sources: Sources): Sinks {
  const { dom, todos$, router } = sources;

  const title$ = newTodo(dom);

  const activeTodos$ = map(rFilter((todo: Todo) => !todo.completed()), todos$);
  const completedTodos$ = map(rFilter((todo: Todo) => todo.completed()), todos$);

  const filteredTodos$: Stream<Array<Todo>> =
    switchLatest(map<DefineReturn, Stream<Array<Todo>>>(rProp('value'), router.define({
      '/active': activeTodos$,
      '/completed': completedTodos$,
      '*': todos$,
    })));

  const add$ = map(addTodoService, title$);

  const todoItemSinksList$ =
    hold(map(
      (todos: Array<Todo>) => {
        const toTodoItemViewStream =
          (todo: Todo) => TodoItem({ dom, todo$: just(todo) });

        return rMap(toTodoItemViewStream, todos);
      },
      filteredTodos$,
    ));

  const todoItemView$s$ =
    streamMapProp<TodoItemSinks, VNode>(`view$`, todoItemSinksList$);

  const todoItemViews$ = startWith([], switchCombine<VNode>(todoItemView$s$));

  const todoItemSave$s$ =
    streamMapProp<TodoItemSinks, Todo>(`save$`, todoItemSinksList$);

  const saveAll$ = switchMerge<Todo>(todoItemSave$s$);

  const todoItemRemove$s$ =
    streamMapProp<TodoItemSinks, number>(`remove$`, todoItemSinksList$);

  const remove$ = switchMerge<number>(todoItemRemove$s$);

  const activeTodoItemCount$ = map(activeTodos => activeTodos.length, activeTodos$);

  const completedTodoItemCount$ = map(completedTodos => completedTodos.length, completedTodos$);

  const todoItemCount$ = map(todos => todos.length, todos$);

  const model$ =
    combineObj<Model>(
      {
        todoItems: todoItemViews$,
        activeTodoItemCount$,
        completedTodoItemCount$,
        todoItemCount$,
      },
    );

  const view$ = map(view, model$);

  return { view$, add$, saveAll$, remove$, route$: never() };
}

function streamMapProp<A, B>(property: string, stream: Stream<Array<A>>): Stream<Array<Stream<B>>> {
  return map(
    event => mapProp<A, Stream<B>>(property, event),
    stream,
  );
}
