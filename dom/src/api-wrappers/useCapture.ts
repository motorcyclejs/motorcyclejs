import { DomSource, EventsFnOptions, StandardEvents } from '../types'

import { Stream } from 'most'
import { VNode } from 'mostly-dom'

export function useCapture(domSource: DomSource): DomSource {
  return {
    select(cssSelector: string) {
      return domSource.select(cssSelector)
    },

    elements<T extends Element>() {
      return domSource.elements<T>()
    },

    events(eventType: StandardEvents) {
      return domSource.events(eventType, { useCapture: true })
    },

    namespace() {
      return domSource.namespace()
    },

    isolateSource(source: DomSource, scope: string) {
      return domSource.isolateSource(source, scope)
    },

    isolateSink(sink: Stream<VNode>, scope: string) {
      return domSource.isolateSink(sink, scope)
    },
  }
}
