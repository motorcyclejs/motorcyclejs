import { DomSource, events, query } from '@motorcycle/dom'
import { Stream, scan, skip } from 'most'

import { TodoItemStyles } from './styles'

export function toggleCompleted(dom: DomSource): Stream<boolean> {
  const toggle = query(`.${TodoItemStyles.toggleClass}`, dom)

  const click$ = events('click', toggle)

  const completed$ = skip(1, scan((x) => !x, false, click$))

  return completed$
}
