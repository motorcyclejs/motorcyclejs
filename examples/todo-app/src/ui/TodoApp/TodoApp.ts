import { DomSource, VNode, isolateDom } from '@motorcycle/dom'
import { Model, Sinks, Sources } from './types'
import { Stream, just, map, never, startWith } from 'most'
import { Todo, Uid } from '../../domain/model'
import { TodoItem, TodoItemSinks } from '../TodoItem'
import { mapProp, switchCombine, switchMerge } from '../helpers'

import { clearCompleted } from './clearCompleted'
import { combineObj } from 'most-combineobj'
import { hold } from '@most/hold'
import { newTodo } from './newTodo'
import { map as rMap } from '167'
import { view } from './view'

export function TodoApp(sources: Sources): Sinks {
  const {
    dom,
    todos$,
    activeTodoItemCount$,
    completedTodoItemCount$,
    todoItemCount$,
  } = sources

  const addTodo$ = newTodo(dom)
  const clearCompletedTodos$ = clearCompleted(dom)

  const todoItemSinks$: Stream<ReadonlyArray<TodoItemSinks>> =
    hold(map(rMap(toTodoItem(dom)), todos$))

  const todoItemView$s$ =
    mapProp<TodoItemSinks>('view$', todoItemSinks$)

  const todoItemViews$ = startWith([], switchCombine<VNode>(todoItemView$s$))

  const todoItemRemove$s$ =
    mapProp<TodoItemSinks>('remove$', todoItemSinks$)

  const removeTodo$ = switchMerge(todoItemRemove$s$)

  const todoItemUpdate$s$ =
    mapProp<TodoItemSinks>('update$', todoItemSinks$)

  const updateTodo$ = switchMerge(todoItemUpdate$s$)

  const model$ = combineObj<Model>(
    {
      activeTodoItemCount$,
      completedTodoItemCount$,
      todoItemCount$,
      todoItems$: todoItemViews$,
    },
  )

  const view$ = map(view, model$)

  return {
    view$,
    addTodo$,
    clearCompletedTodos$,
    updateTodo$,
    showActiveTodos$: never(),
    showAllTodos$: never(),
    showCompletedTodos$: never(),
    removeTodo$,
  }
}

function toTodoItem(dom: DomSource) {
  return function(todo: Todo) {
    return isolateDom(TodoItem)({ dom, todo$: just(todo) })
  }
}
