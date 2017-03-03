import { Title, Todo } from '../model';

export const editTodoTitle =
  (title: Title, todo: Todo): Todo => ({...todo, title});
