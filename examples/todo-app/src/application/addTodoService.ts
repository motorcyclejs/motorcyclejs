import { Todo, createTodo } from '../domain/model/Todo';

import { Title } from '../domain/model/Title';

export function addTodoService(title: string): Todo {
  const todo = createTodo(new Title(title));

  return todo;
}
