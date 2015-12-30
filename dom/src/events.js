import {empty} from 'most'
import fromEvent from './fromEvent'
import {makeIsStrictlyInRootScope} from './select'

let matchesSelector
try {
  matchesSelector = require(`matches-selector`)
} catch (err) {
  matchesSelector = () => {}
}

function makeEventsSelector(rootElement$, selector) {
  return function eventsSelector(type, useCapture = false) {
    if (typeof type !== `string`) {
      throw new Error(`DOM drivers events() expects argument to be a ` +
        `string representing the event type to listen for.`)
    }
    return rootElement$
      .map(rootElement => ({rootElement, selector}))
      .skipRepeatsWith((prev, curr) => {
        return prev.selector.join(``) === curr.selector.join(``)
      })
      .map(({rootElement}) => {
        if (!rootElement) {
          return empty()
        }

        if (matchesSelector(rootElement, selector.join(` `))) {
          return fromEvent(type, rootElement, useCapture)
        }

        return fromEvent(type, rootElement, useCapture)
          .filter(ev => {
            if (matchesSelector(ev.target, selector.join(` `)) ||
              matchesSelector(ev.target, selector.join(``)))
            {
              return makeIsStrictlyInRootScope(selector)(ev.target)
            }
            return false
          })
      })
      .switch()
      .multicast()
  }
}

export default makeEventsSelector
