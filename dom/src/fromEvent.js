import Stream from 'most/lib/Stream'
import MulticastSource from 'most/lib/source/MulticastSource'
import forEach from 'fast.js/array/forEach'

const tryEvent =
  (time, event, sink) => {
    try {
      sink.event(time, event)
    } catch (err) {
      sink.error(time, err)
    }
  }

const EventAdapter = function EventAdapter(// eslint-disable-line
  init,
  type,
  nodes,
  useCapture,
  sink,
  scheduler
) {
  this.type = type
  this.nodes = nodes
  this.useCapture = useCapture

  const listener = event => {
    tryEvent(scheduler.now(), event, sink)
  }

  this._dispose = init(
    nodes,
    type,
    listener,
    useCapture
 )
}

EventAdapter.prototype.dispose = function dispose() {
  return this._dispose(this.type, this.nodes)
}

const initEventTarget =
  (nodes, type, listener, useCapture) => { // eslint-disable-line
    forEach(
      nodes,
      kValue => kValue.addEventListener(type, listener, useCapture)
    )

    const dispose = (type_, target) => {
      forEach(
        target,
        kValue => kValue.removeEventListener(type_, listener, useCapture)
      )
    }

    return dispose
  }

function EventTargetSource(type, nodes, useCapture) {
  this.type = type
  this.nodes = nodes
  this.useCapture = useCapture
}

EventTargetSource.prototype.run = function run(sink, scheduler) {
  return new EventAdapter(
    initEventTarget,
    this.type,
    this.nodes,
    this.useCapture,
    sink,
    scheduler
 )
}

const fromEvent =
  (type, nodes, useCapture = false) => {
    if (!nodes.length) {
      throw new Error(`nodes must be a NodeList or an Array of DOM Nodes`)
    }

    let source
    if (nodes[0].addEventListener && nodes[0].removeEventListener) {
      source = new MulticastSource(
        new EventTargetSource(type, nodes, useCapture)
      )
    } else {
      throw new Error(
        `nodes must support addEventListener/removeEventListener`
      )
    }
    return new Stream(source)
  }

export default fromEvent
