import { Sinks, Sources } from './types'
import { map, sampleWith } from 'most'

import { Todo } from '../../domain/model'
import { filter } from '167'

export function ClearCompleted(sinks: Sinks): Sources {
  const { clearCompletedTodos$, todos$ } = sinks

  const updatedTodos$ =
    map(clearCompleted, sampleWith(clearCompletedTodos$, todos$))

  return { todos$: updatedTodos$ }
}

function clearCompleted(todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> {
  return filter((todo) => !todo.completed, todos)
}
