import { Stream } from 'most';
import { Todo } from './types';

/**
 * A TodoRepository is a Effectful Component (Sinks -> Sources) that
 * persists todos to some kind of storage medium. This storage medium is an
 * implementation detail. It could be local or session storage, a remote
 * database or anywhere. These implementations will live in the infrastruture
 * folder. It is important that these types are defined by your domain and only
 * in a manner than makes sense to your business. Like the domain model types,
 * this is only to be decided by your given business domain and not a 3rd party
 * API.
 */
export type TodoRepository =
  (sinks: TodoRepositorySinks) => TodoRepositorySources;

export type TodoRepositorySinks =
  {
    todos$: Stream<Array<Todo>>;
  };

export type TodoRepositorySources =
  {
    todos$: Stream<Array<Todo>>;
  }
