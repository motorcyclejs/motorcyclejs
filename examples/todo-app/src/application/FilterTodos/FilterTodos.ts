import { CaptureClicks, History } from '@motorcycle/history'
import { DefineReturn, Router, define } from '@motorcycle/router'
import { Sinks, Sources } from './types'
import { Stream, constant, map, merge, switchLatest } from 'most'

import { Todo } from '../../domain/model'
import { filter } from '167'

export function FilterTodos(sinks: Sinks): Sources {
  const { showActiveTodos$, showAllTodos$, showCompletedTodos$, todos$ } = sinks

  const history$ =
    merge(
      constant('/', showAllTodos$),
      constant('/active', showActiveTodos$),
      constant('/completed', showCompletedTodos$),
    )

  const { router } = Router(CaptureClicks(History)({ history$ }))

  const routes =
    {
      '/active': map(filterCompleted, todos$),
      '/completed': map(filterActive, todos$),
      '*': todos$,
    }

  const defineReturn$ = define(routes, router)

  const filteredTodos$ =
    switchLatest(map<DefineReturn, Stream<ReadonlyArray<Todo>>>((x) => x.value, defineReturn$))

  return { todos$: filteredTodos$ }
}

function filterCompleted(todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  return filter((todo) => !todo.completed, todos)
}

function filterActive(todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  return filter((todo) => todo.completed, todos)
}
