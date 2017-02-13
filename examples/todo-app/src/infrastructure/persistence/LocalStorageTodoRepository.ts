import { LocalStorage, setItem } from '@motorcycle/local-storage';
import {
  Todo,
  TodoRepositorySinks,
  TodoRepositorySources,
} from '../../domain/model/Todo';
import { map, merge } from 'most';
import {
  concat as rConcat,
  findIndex as rFindIndex,
  insert as rInsert,
  map as rMap,
  pipe as rPipe,
  remove as rRemove,
} from 'ramda';

import { Title } from '../../domain/model/Title';
import { proxy } from 'most-proxy';
import { sample } from '@most/sample';

const DB_NAME = `todos-motorcycle`;

export function LocalStorageTodoRepository(
  sinks: TodoRepositorySinks,
): TodoRepositorySources {
  const { attach, stream: proxyTodos$ } = proxy<Array<Todo>>();

  const { add$, saveAll$, remove$ } = sinks;

  const jsonTodos$ =
    merge(
      sample(toJson, add$, proxyTodos$),
      sample(editTodo, saveAll$, proxyTodos$),
      map(
        rPipe(rMap(toObj), JSON.stringify),
        sample(removeTodo, remove$, proxyTodos$),
      ),
    );

  const setItemCommand$ = map(setItem(DB_NAME), jsonTodos$);

  const localStorage$ = setItemCommand$;

  const { localStorage: { getItem } } = LocalStorage({ localStorage$ });

  const todos$ = attach(map(toTodos, getItem(DB_NAME)));

  return { todos$ };
}

function toJson(todo: Todo, todos: Array<Todo>): string {
  return JSON.stringify(rMap(toObj, rConcat(todos, [todo])));
}

function toObj(todo: Todo): TodoObj {
  return {
    id: todo.id(),
    completed: todo.completed(),
    title: todo.title().value(),
  };
}

function removeTodo(id: number, todos: Array<Todo>): Array<Todo> {
  const index = rFindIndex((todo: Todo) => id === todo.id(), todos);

  return rRemove(index, 1, todos);
}

function editTodo(todo: Todo, todos: Array<Todo>): string {
  const index = rFindIndex((t: Todo) => t.id() === todo.id(), todos);

  return JSON.stringify(rMap(toObj, rInsert(index, todo, rRemove(index, 1, todos))));
}

function toTodos(jsonTodos: string | null): Array<Todo> {
  if (!jsonTodos)
    return [];

  const todoObjs: Array<TodoObj> = JSON.parse(jsonTodos);

  return rMap(toTodo, todoObjs);
}

interface TodoObj {
  id: number;
  completed: boolean;
  title: string;
}

function toTodo(todoObj: TodoObj): Todo {
  const { id, completed, title } = todoObj;

  return new Todo(id, completed, new Title(title));
}
