import { Title, Todo } from '../../domain/model'

import { Stream } from 'most'

export type Sinks =
  {
    addTodo$: Stream<Title>;
    todos$: Stream<ReadonlyArray<Todo>>;
  }

export type Sources =
  {
    todos$: Stream<ReadonlyArray<Todo>>;
  }
