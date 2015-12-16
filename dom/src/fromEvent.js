import Stream from 'most/lib/Stream'
import MulticastSource from 'most/lib/source/MulticastSource'
import forEach from 'fast.js/array/forEach'

const tryEvent =
  (t, x, sink) => {
    try {
      sink.event(t, x)
    } catch (e) {
      sink.error(t, e)
    }
  }

const EventAdapter = function EventAdapter(// eslint-disable-line
  init,
  event,
  source,
  useCapture,
  sink,
  scheduler
) {
  this.event = event
  this.source = source
  this.useCapture = useCapture

  const addEvent = ev => {
    tryEvent(scheduler.now(), ev, sink)
  }

  this._dispose = init(
    source,
    event,
    addEvent,
    useCapture
 )
}

EventAdapter.prototype.dispose = function dispose() {
  return this._dispose(this.event, this.source)
}

const initEventTarget =
  (source, event, addEvent, useCapture) => { // eslint-disable-line
    forEach(
      source,
      s => s.addEventListener(event, addEvent, useCapture)
    )

    const dispose = (_event, target) => {
      forEach(
        target,
        t => t.removeEventListener(_event, addEvent, useCapture)
      )
    }

    return dispose
  }

function EventTargetSource(event, source, useCapture) {
  this.event = event
  this.source = source
  this.useCapture = useCapture
}

EventTargetSource.prototype.run = function run(sink, scheduler) {
  return new EventAdapter(
    initEventTarget,
    this.event,
    this.source,
    this.useCapture,
    sink,
    scheduler
 )
}

const fromEvent =
  (event, source, useCapture = false) => {
    // is not a NodeList
    if (!source.length) {
      throw new Error(
        `source must be a NodeList or an Array of DOM Nodes`
     )
    }

    let s
    if (source[0].addEventListener && source[0].removeEventListener) {
      s = new MulticastSource(
        new EventTargetSource(event, source, useCapture)
     )
    } else {
      throw new Error(
        `source must support addEventListener/removeEventListener`
     )
    }
    return new Stream(s)
  }

export default fromEvent
