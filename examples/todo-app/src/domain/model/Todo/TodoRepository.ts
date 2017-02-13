import { Stream } from 'most';
import { Todo } from './';

export type TodoRepository = (_: TodoRepositorySinks) => TodoRepositorySources;

export interface TodoRepositorySinks {
  add$: Stream<Todo>;
  saveAll$: Stream<Todo>;
  remove$: Stream<number>;
}

export interface TodoRepositorySources {
  todos$: Stream<Array<Todo>>;
}
