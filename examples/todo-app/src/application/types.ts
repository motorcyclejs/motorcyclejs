import { Title, Todo, TodoRepository, Uid } from '../domain/model'

import { Stream } from 'most'

export type ApplicationSinks =
  {
    addTodo$: Stream<Title>;
    updateTodo$: Stream<Todo>;
    removeTodo$: Stream<Uid>;
    showActiveTodos$: Stream<true>;
    showCompletedTodos$: Stream<true>;
    showAllTodos$: Stream<true>;
    clearCompletedTodos$: Stream<true>;
  }

export type ApplicationSources =
  {
    todos$: Stream<ReadonlyArray<Todo>>;
    activeTodoItemCount$: Stream<number>;
    completedTodoItemCount$: Stream<number>;
    todoItemCount$: Stream<number>;
  }

export type Infrastructure =
  {
    TodoRepository: TodoRepository;
  }
