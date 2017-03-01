import { Todo, Uid } from '../../domain/model';

import { Stream } from 'most';

export type Sinks =
  {
    removeTodo$: Stream<Uid>;
    todos$: Stream<Array<Todo>>;
  };

export type Sources =
  {
    todos$: Stream<Array<Todo>>;
  };
