import { Title } from '../Title';
import { Todo } from './';

export function editTodo(title: string, todo: Todo): Todo {
  return new Todo(todo.id(), todo.completed(), new Title(title));
}
