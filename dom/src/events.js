import {domEvent} from '@most/dom-event'
import {makeIsStrictlyInRootScope} from './makeIsStrictlyInRootScope'

let matchesSelector
try {
  matchesSelector = require(`matches-selector`)
} catch (e) {
  matchesSelector = () => {}
}

const eventTypesThatDontBubble = [
  `load`,
  `unload`,
  `focus`,
  `blur`,
  `mouseenter`,
  `mouseleave`,
  `submit`,
  `change`,
  `reset`,
  `timeupdate`,
  `playing`,
  `waiting`,
  `seeking`,
  `seeked`,
  `ended`,
  `loadedmetadata`,
  `loadeddata`,
  `canplay`,
  `canplaythrough`,
  `durationchange`,
  `play`,
  `pause`,
  `ratechange`,
  `volumechange`,
  `suspend`,
  `emptied`,
  `stalled`,
]

function maybeMutateEventPropagationAttributes(event) {
  if (!event.hasOwnProperty(`propagationHasBeenStopped`)) {
    event.propagationHasBeenStopped = false
    const oldStopPropagation = event.stopPropagation
    event.stopPropagation = function stopPropagation() {
      oldStopPropagation.call(this)
      this.propagationHasBeenStopped = true
    }
  }
}

function mutateEventCurrentTarget(event, currentTargetElement) {
  try {
    Object.defineProperty(event, `currentTarget`, {
      value: currentTargetElement,
      configurable: true,
    })
  } catch (err) {
    console.log(`please use event.ownerTarget`)
  }
  event.ownerTarget = currentTargetElement
}

function makeSimulateBubbling(namespace, rootEl) {
  const isStrictlyInRootScope = makeIsStrictlyInRootScope(namespace)
  const descendantSel = namespace.join(` `)
  const topSel = namespace.join(``)
  const roof = rootEl.parentElement

  return function simulateBubbling(ev) {
    maybeMutateEventPropagationAttributes(ev)
    if (ev.propagationHasBeenStopped) {
      return false
    }
    for (let el = ev.target; el && el !== roof; el = el.parentElement) {
      if (!isStrictlyInRootScope(el)) {
        continue
      }
      if (matchesSelector(el, descendantSel) || matchesSelector(el, topSel)) {
        mutateEventCurrentTarget(ev, el)
        return true
      }
    }
    return false
  }
}

const defaults = {
  useCapture: false,
}

function makeEventsSelector(rootElement$, namespace) {
  return function eventsSelector(type, options = defaults) {
    if (typeof type !== `string`) {
      throw new Error(`DOM driver's events() expects argument to be a ` +
        `string representing the event type to listen for.`)
    }
    let useCapture = false
    if (typeof options.useCapture === `boolean`) {
      useCapture = options.useCapture
    }
    if (eventTypesThatDontBubble.indexOf(type) !== -1) {
      useCapture = true
    }

    return rootElement$
      .map(rootElement => ({rootElement, namespace}))
      .skipRepeatsWith((prev, curr) => {
        return prev.namespace.join(``) === curr.namespace.join(``)
      })
      .map(({rootElement}) => {
        if (!namespace || namespace.length === 0) {
          return domEvent(type, rootElement, useCapture)
        }
        const simulateBubbling = makeSimulateBubbling(namespace, rootElement)
        return domEvent(type, rootElement, useCapture)
          .filter(simulateBubbling)
      })
      .switch()
      .multicast()
  }
}

export {makeEventsSelector}
