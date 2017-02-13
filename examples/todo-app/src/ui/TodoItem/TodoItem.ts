import { Model, Sinks, Sources, toggle, view } from './';
import { just, map, merge } from 'most';

import { combineObj } from 'most-combineobj';
import { isolateDom } from '../helpers';
import { sample } from '@most/sample';
import { toggleTodoCompletedService } from '../../application';

function TodoItemFn(sources: Sources): Sinks {
  const { dom, todo$ } = sources;

  const toggle$ = toggle(dom);

  const save$ =
    merge(
      todo$,
      sample(
        (_, todo) => toggleTodoCompletedService(todo),
        toggle$,
        todo$,
      ),
    );

  const model$ = combineObj<Model>({ todo$ });

  const view$ = map(view, model$);

  return { view$, save$ };
}

export const TodoItem = isolateDom(TodoItemFn);
