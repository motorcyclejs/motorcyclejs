import { Sinks, Sources } from './types'
import { Todo, Uid } from '../../domain/model'
import { findIndex, remove } from '167'

import { sample } from '@most/sample'

export function RemoveTodo(sinks: Sinks): Sources {
  const { removeTodo$, todos$ } = sinks

  const updatedTodos$ = sample(removeTodo, removeTodo$, todos$)

  return { todos$: updatedTodos$ }
}

function removeTodo(todoId: Uid, todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  const index = findIndex(({ id }) => id === todoId, todos)

  return remove(index, 1, todos)
}
