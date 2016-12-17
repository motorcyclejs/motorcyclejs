import { Stream } from 'most';
import { DomSource, EventsFnOptions, StandardEvents, VNode } from '../../types';

export function useCapture(domSource: DomSource): DomSource {
  return {
    select(cssSelector: string) {
      return domSource.select(cssSelector);
    },

    elements() {
      return domSource.elements();
    },

    events(eventType: StandardEvents) {
      return domSource.events(eventType, { useCapture: true });
    },

    namespace() {
      return domSource.namespace();
    },

    isolateSource(source: DomSource, scope: string) {
      return domSource.isolateSource(source, scope);
    },

    isolateSink(sink: Stream<VNode>, scope: string) {
      return domSource.isolateSink(sink, scope);
    },
  };
}
