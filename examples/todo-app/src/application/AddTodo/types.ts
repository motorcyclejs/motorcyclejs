import { Title, Todo } from '../../domain/model';

import { Stream } from 'most';

export type Sinks =
  {
    addTodo$: Stream<Title>;
    todos$: Stream<Array<Todo>>;
  };

export type Sources =
  {
    todos$: Stream<Array<Todo>>;
  };
