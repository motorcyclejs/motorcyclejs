import { Todo } from './';

export function toggleTodoCompleted(todo: Todo): Todo {
  const toggledTodo = new Todo(todo.id(), !todo.completed(), todo.title());

  return toggledTodo;
}
