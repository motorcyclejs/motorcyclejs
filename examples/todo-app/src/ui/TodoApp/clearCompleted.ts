import { DomSource, events, query } from '@motorcycle/dom'
import { Stream, constant } from 'most'

import { todoAppStyles } from './styles'

export function clearCompleted(dom: DomSource): Stream<true> {
  const clearCompleted = query(`.${todoAppStyles.clearCompletedClass}`, dom)

  const click$ = events('click', clearCompleted)

  const clearCompleted$ = constant<Event, true>(true, click$)

  return clearCompleted$
}
