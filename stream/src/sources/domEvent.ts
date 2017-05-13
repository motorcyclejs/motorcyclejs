import { Disposable, Scheduler, Sink, Stream } from '@most/types'

export type DomEventInput =
  {
    readonly eventType: string,
    readonly node: EventTarget,
    readonly useCapture?: boolean,
  }

export const domEvent = <E extends Event>(input: DomEventInput): Stream<E> => new DomEvent<E>(input)

class DomEvent<E extends Event> implements Stream<E> {
  private eventType: string
  private node: EventTarget
  private useCapture: boolean

  constructor({ eventType, node, useCapture }: DomEventInput) {
    this.eventType = eventType
    this.node = node
    this.useCapture = useCapture || false
  }

  public run(sink: Sink<E>, scheduler: Scheduler): Disposable {
    const { eventType, node, useCapture } = this

    const send = (event: E) => sink.event(scheduler.now(), event)
    const dispose = () => node.removeEventListener(eventType, send, useCapture)

    return { dispose }
  }
}
