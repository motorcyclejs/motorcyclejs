import { Todo, editTodo } from '../domain/model/Todo';

export function editTodoService(title: string, todo: Todo): Todo {
  return editTodo(title, todo);
}
