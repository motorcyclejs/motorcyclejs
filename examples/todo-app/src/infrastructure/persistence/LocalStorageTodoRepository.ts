import { LocalStorage, setItem } from '@motorcycle/local-storage'
import { Stream, map, skipRepeats } from 'most'
import {
  Todo,
  TodoRepository,
  TodoRepositorySinks,
  TodoRepositorySources,
} from '../../domain/model'

import { hold } from '@most/hold'

export const LocalStorageTodoRepository: TodoRepository =
  LocalStorageTodoRepostioryFn

const TODO_DB = `motorcycle-todos`

const toTodos = (json: string | null) => json ? JSON.parse(json) : []

function LocalStorageTodoRepostioryFn(sinks: TodoRepositorySinks): TodoRepositorySources {
  const localStorage$ =
    map(setItem(TODO_DB), skipRepeats(map(JSON.stringify, sinks.todos$)))

  const { localStorage: { getItem } } = LocalStorage({ localStorage$ })

  const todos$: Stream<ReadonlyArray<Todo>> =
    hold(map(toTodos, getItem(TODO_DB)))

  return { todos$ }
}
