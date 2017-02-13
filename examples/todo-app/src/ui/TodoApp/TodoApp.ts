import { Sinks, Sources, newTodoStream, view } from './';
import { Stream, just, map, startWith } from 'most';
import { TodoItem, Sinks as TodoItemSinks } from '../TodoItem';
import { mapProp, switchCombine, switchMerge } from '../helpers';

import { Todo } from '../../domain/model/Todo';
import { VNode } from '@motorcycle/dom';
import { addTodoService } from '../../application';
import { hold } from '@most/hold';
import { map as rMap } from 'ramda';

export function TodoApp(sources: Sources): Sinks {
  const { dom, todos$ } = sources;

  const title$ = newTodoStream(dom);

  const add$ = map(addTodoService, title$);

  const todoItemSinksList$ =
    hold(map(
      (todos: Array<Todo>) => {
        const toTodoItemViewStream =
          (todo: Todo) => TodoItem({ dom, todo$: just(todo) });

        return rMap(toTodoItemViewStream, todos);
      },
      todos$,
    ));

  const todoItemView$s$ =
    streamMapProp<TodoItemSinks, VNode>(`view$`, todoItemSinksList$);

  const todoItemViews$ = switchCombine<VNode>(todoItemView$s$);

  const todoItemSave$s$ =
    streamMapProp<TodoItemSinks, Todo>(`save$`, todoItemSinksList$);

  const saveAll$ = switchCombine<Todo>(todoItemSave$s$);

  const todoItemRemove$s$ =
    streamMapProp<TodoItemSinks, number>(`remove$`, todoItemSinksList$);

  const remove$ = switchMerge<number>(todoItemRemove$s$);

  const view$ = map(view, startWith([], todoItemViews$));

  return { view$, add$, saveAll$, remove$ };
}

function streamMapProp<A, B>(property: string, stream: Stream<Array<A>>): Stream<Array<Stream<B>>> {
  return map(
    event => mapProp<A, Stream<B>>(property, event),
    stream,
  );
}
