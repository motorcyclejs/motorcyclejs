import { Model, Sinks, Sources, toggle, view } from './';
import { combine, just, map } from 'most';

import { combineObj } from 'most-combineobj';
import { createKey } from '../helpers';
import { toggleTodoCompletedService } from '../../application'

export function TodoItem(sources: Sources): Sinks {
  const { dom, todo$ } = sources;

  const key = createKey();

  const toggle$ = toggle(dom, key);

  const save$ =
    combine(
      (_, todo) => toggleTodoCompletedService(todo),
      toggle$,
      todo$,
    );

  const model$ = combineObj<Model>({ key: just(key), toggle$, todo$ });

  const view$ = map(view, model$);

  return { view$, save$ };
}
