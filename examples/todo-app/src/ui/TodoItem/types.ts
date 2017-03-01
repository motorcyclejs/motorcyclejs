import { DomSinks, DomSources } from '../../../../../dom/src';
import { Todo, Uid } from '../../domain/model';

import { Stream } from 'most';

export type TodoItemSources = DomSources &
  {
    todo$: Stream<Todo>;
  };

export type TodoItemSinks = DomSinks &
  {
    remove$: Stream<Uid>;
    update$: Stream<Todo>;
  };

export type Model =
  {
    todo: Todo;
    editing: boolean;
  };
