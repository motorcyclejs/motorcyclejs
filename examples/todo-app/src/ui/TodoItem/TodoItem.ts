import { Model, Sinks, Sources, edit, remove, toggleCompleted, view } from './';
import { combine, filter, map, merge, sampleWith } from 'most';
import { editTodoService, toggleTodoCompletedService } from '../../application';

import { Todo } from '../../domain/model/Todo';
import { combineObj } from 'most-combineobj';
import { isolateDom } from '../helpers';
import { sample } from '@most/sample';

function TodoItemFn(sources: Sources): Sinks {
  const { dom, todo$ } = sources;

  const { editing$, value$ } = edit(dom);

  const save$ =
    merge(
      todo$,
      sample<boolean, Todo, Todo>(
        (_, todo) => toggleTodoCompletedService(todo),
        toggleCompleted(dom),
        todo$,
      ),
      sampleWith(
        filter(x => !x, editing$),
        combine(editTodoService, value$, todo$),
      ),
    );

  const remove$ = map(todo => todo.id(), sampleWith(remove(dom), todo$));

  const model$ = combineObj<Model>({ todo$, editing$ });

  const view$ = map(view, model$);

  return { view$, save$, remove$ };
}

export const TodoItem = isolateDom(TodoItemFn);
