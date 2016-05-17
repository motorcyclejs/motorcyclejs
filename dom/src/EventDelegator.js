import {ScopeChecker} from './ScopeChecker'
import {getScope, getSelectors, matchesSelector} from './util'

function patchEvent (event) {
  const pEvent = event
  pEvent.propagationHasBeenStopped = false
  const oldStopPropagation = pEvent.stopPropagation
  pEvent.stopPropagation = function stopPropagation () {
    oldStopPropagation.call(this)
    this.propagationHasBeenStopped = true
  }
  return pEvent
}

function mutateEventCurrentTarget (event, currentTargetElement) {
  try {
    Object.defineProperty(event, 'currentTarget', {
      value: currentTargetElement,
      configurable: true
    })
  } catch (err) {
    console.log('please use event.ownerTarget')
  }
  event.ownerTarget = currentTargetElement
}

export class EventDelegator {
  constructor (topElement, eventType, useCapture, isolateModule) {
    this.topElement = topElement
    this.eventType = eventType
    this.useCapture = useCapture
    this.isolateModule = isolateModule
    this.roof = topElement.parentElement
    this.destinations = []

    if (useCapture) {
      this.domListener = ev => this.capture(ev)
    } else {
      this.domListener = ev => this.bubble(ev)
    }

    topElement.addEventListener(eventType, this.domListener, useCapture)
  }

  bubble (rawEvent) { // eslint-disable-line complexity
    if (!document.body.contains(rawEvent.currentTarget)) { return }
    const ev = patchEvent(rawEvent)

    for (let el = ev.target; el && el !== this.roof; el = el.parentElement) {
      if (ev.propagationHasBeenStopped) { return }
      this.matchEventAgainstDestinations(el, ev)
    }
  }

  matchEventAgainstDestinations (el, ev) { // eslint-disable-line complexity
    for (let i = 0, n = this.destinations.length; i < n; ++i) {
      const dest = this.destinations[i]
      if (!dest.scopeChecker.isStrictlyInRootScope(el)) { continue }
      if (matchesSelector(el, dest.selector)) {
        mutateEventCurrentTarget(ev, el)
        dest.subject.next(ev)
      }
    }
  }

  capture (ev) {
    for (let i = 0, n = this.destinations.length; i < n; i++) {
      const dest = this.destinations[i]
      if (matchesSelector(ev.target, dest.selector)) {
        dest.subject.next(ev)
      }
    }
  }

  addDestination (subject, namespace) {
    const scope = getScope(namespace)
    const selector = getSelectors(namespace)
    const scopeChecker = new ScopeChecker(scope, this.isolateModule)
    this.destinations.push({subject, scopeChecker, selector})
  }

  updateTopElement (newTopElement) {
    const eventType = this.eventType
    const domListener = this.domListener
    const useCapture = this.useCapture
    this.topElement.removeEventListener(eventType, domListener, useCapture)
    newTopElement.addEventListener(eventType, domListener, useCapture)
    this.topElement = newTopElement
  }

}
