import { DomSinks, DomSources } from '../types';

import { Stream } from 'most';
import { Todo } from '../../domain/model/Todo';

export type Sinks =
  DomSinks &
  {
    save$: Stream<Todo>;
    remove$: Stream<number>;
  };

export type Sources =
  DomSources &
  {
    todo$: Stream<Todo>;
  };

export interface Model {
  todo: Todo;
  editing: boolean;
}
