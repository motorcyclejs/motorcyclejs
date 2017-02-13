import { Model, Sinks, Sources, remove, toggleCompleted, view } from './';
import { map, sampleWith } from 'most';

import { Todo } from '../../domain/model/Todo';
import { combineObj } from 'most-combineobj';
import { isolateDom } from '../helpers';
import { sample } from '@most/sample';
import { toggleTodoCompletedService } from '../../application';

function TodoItemFn(sources: Sources): Sinks {
  const { dom, todo$ } = sources;

  const save$ =
    sample<boolean, Todo, Todo>(
      (_, todo) => toggleTodoCompletedService(todo),
      toggleCompleted(dom),
      todo$,
    );

  const remove$ = map(todo => todo.id(), sampleWith(remove(dom), todo$));

  const model$ = combineObj<Model>({ todo$ });

  const view$ = map(view, model$);

  return { view$, save$, remove$ };
}

export const TodoItem = isolateDom(TodoItemFn);
