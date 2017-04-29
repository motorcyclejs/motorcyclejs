import { CurriedFunction2, curry2 } from '@most/prelude'
import { DomSource, StandardEvents } from '../types'

import { Stream } from 'most'

export const events: EventsFn = curry2<StandardEvents, DomSource, Stream<Event>>(
  function(eventType: StandardEvents, domSource: DomSource): Stream<Event> {
    return domSource.events(eventType)
  },
)

export interface EventsFn {
  (): EventsFn

  <T extends Event>(eventType: StandardEvents | string): (domSource: DomSource) => Stream<T>
  <T extends Event>(eventType: StandardEvents | string, domSource: DomSource): Stream<T>
}
