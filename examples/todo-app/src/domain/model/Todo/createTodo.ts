import { Title } from '../Title';
import { Todo } from './';

export function createTodo(title: Title): Todo {
  return new Todo(
    Date.now(),
    false,
    title,
  );
}
