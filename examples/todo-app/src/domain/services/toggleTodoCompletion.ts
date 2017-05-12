import { Todo } from '../model'

export const toggleTodoCompletion =
  (todo: Todo): Todo => ({ ...todo, completed: !todo.completed })
