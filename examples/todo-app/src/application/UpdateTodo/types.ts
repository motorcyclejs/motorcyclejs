import { Stream } from 'most';
import { Todo } from '../../domain/model';

export type Sinks =
  {
    updateTodo$: Stream<Todo>;
    todos$: Stream<Array<Todo>>;
  };

export type Sources =
  {
    todos$: Stream<Array<Todo>>;
  };
