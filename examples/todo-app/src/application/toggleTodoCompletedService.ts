import { Todo, toggleTodoCompleted } from '../domain/model/Todo';

export function toggleTodoCompletedService(todo: Todo): Todo {
  return toggleTodoCompleted(todo);
}
