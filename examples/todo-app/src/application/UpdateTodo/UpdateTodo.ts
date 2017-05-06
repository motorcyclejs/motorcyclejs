import { Sinks, Sources } from './types'
import { findIndex, update } from '167'

import { Todo } from '../../domain/model'
import { sample } from '@most/sample'

export function UpdateTodo(sinks: Sinks): Sources {
  const { updateTodo$, todos$ } = sinks

  const updatedTodos$ =
    sample(updateTodo, updateTodo$, todos$)

  return { todos$: updatedTodos$ }
}

function updateTodo(todo: Todo, todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  const index = findIndex(({ id }) => id === todo.id, todos)

  return update(index, todo, todos)
}
