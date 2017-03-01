import { Stream } from 'most';
import { Todo } from '../../domain/model';

export type Sinks =
  {
    clearCompletedTodos$: Stream<true>;
    todos$: Stream<Array<Todo>>;
  };

export type Sources =
  {
    todos$: Stream<Array<Todo>>;
  };
