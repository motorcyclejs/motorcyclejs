import {empty} from 'most'
import fromEvent from './fromEvent'
import {makeIsStrictlyInRootScope} from './select'

let matchesSelector
try {
  matchesSelector = require(`matches-selector`)
} catch (err) {
  matchesSelector = () => {}
}

function makeEventsSelector(element$, selector) {
  return function eventsSelector(type, useCapture = false) {
    if (typeof type !== `string`) {
      throw new Error(`DOM drivers events() expects argument to be a ` +
        `string representing the event type to listen for.`)
    }
    return element$
      .map(elements => {
        if (!elements) {
          return empty()
        }

        if (matchesSelector(elements, selector.join(` `))) {
          return fromEvent(type, elements, useCapture)
        }

        return fromEvent(type, elements, useCapture)
          .filter(ev => {
            if (matchesSelector(ev.srcElement, selector.join(` `)) ||
              matchesSelector(ev.srcElement, selector.join(``)))
            {
              return makeIsStrictlyInRootScope(selector)(ev.srcElement)
            }
            return false
          })
      })
      .switch()
      .multicast()
  }
}

export default makeEventsSelector
