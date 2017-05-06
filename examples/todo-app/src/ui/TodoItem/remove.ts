import { DomSource, events, query } from '@motorcycle/dom'
import { Stream, constant } from 'most'

import { TodoItemStyles } from './styles'

export function remove(dom: DomSource): Stream<boolean> {
  const destroy = query(`.${TodoItemStyles.destroyClass}`, dom)

  const click$ = events('click', destroy)

  return constant(true, click$)
}
