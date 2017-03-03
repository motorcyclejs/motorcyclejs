import { Model, TodoItemSinks, TodoItemSources } from './types';
import { editTodoTitle, toggleTodoCompletion } from '../../domain/services';
import { filter, map, merge, sampleWith } from 'most';

import { combineObj } from 'most-combineobj';
import { edit } from './edit';
import { isolateDom } from '../helpers';
import { not } from 'ramda';
import { remove } from './remove';
import { sample } from '@most/sample';
import { toggleCompleted } from './toggleCompleted';
import { view } from './view';

export const TodoItem = isolateDom(function TodoItem(sources: TodoItemSources): TodoItemSinks {
  const { dom, todo$ } = sources;

  const { editing$, value$ } = edit(dom);

  const update$ =
    merge(
      map(toggleTodoCompletion, sampleWith(toggleCompleted(dom), todo$)),
      sampleWith(filter(not, editing$), sample(editTodoTitle, value$, todo$)),
    );

  const remove$ = map(todo => todo.id, sampleWith(remove(dom), todo$));

  const model$ = combineObj<Model>({ todo$, editing$ });

  const view$ = map(view, model$);

  return { view$, update$, remove$ };
});
