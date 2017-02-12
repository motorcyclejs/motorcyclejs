import { Stream } from 'most';
import { Todo } from './';

export type TodoRepository = (_: TodoRepositorySinks) => TodoRepositorySources;

export interface TodoRepositorySinks {
  add$: Stream<Todo>;
  saveAll$: Stream<Array<Todo>>;
}

export interface TodoRepositorySources {
  todos$: Stream<Array<Todo>>;
}
