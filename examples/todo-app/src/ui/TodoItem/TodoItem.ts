import { Model, Sinks, Sources, toggle, view } from './';
import { just, map, merge } from 'most';

import { combineObj } from 'most-combineobj';
import { createKey } from '../helpers';
import { sample } from '@most/sample';
import { toggleTodoCompletedService } from '../../application';

export function TodoItem(sources: Sources): Sinks {
  const { dom, todo$ } = sources;

  const key = createKey();

  const toggle$ = toggle(dom, key);

  const save$ =
    merge(
      todo$,
      sample(
        (_, todo) => toggleTodoCompletedService(todo),
        toggle$,
        todo$,
      ),
    );

  const model$ = combineObj<Model>({ key: just(key), todo$ });

  const view$ = map(view, model$);

  return { view$, save$ };
}
