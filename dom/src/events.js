import {empty} from 'most'
import fromEvent from './fromEvent'

const makeEventsSelector =
  element$ =>
    (type, useCapture = false) => {
      if (typeof type !== `string`) {
        throw new Error(`DOM drivers events() expects argument to be a ` +
          `string representing the event type to listen for.`)
      }
      return element$
        .map(
          elements =>
            elements ?
              fromEvent(type, elements, useCapture) :
              empty()
        )
        .switch()
        .multicast()
    }

export {makeEventsSelector}
