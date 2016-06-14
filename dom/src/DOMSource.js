import {domEvent} from '@most/dom-event'
import {subject} from 'most-subject'

import {isolateSource, isolateSink} from './isolate/isolation'
import {EventDelegator} from './EventDelegator'
import {ElementFinder} from './ElementFinder'
import {getScope, eventTypesThatDontBubble} from './util'

function determineUseCapture (eventType, options) {
  let result = false
  if (typeof options.useCapture === 'boolean') {
    result = options.useCapture
  }

  if (eventTypesThatDontBubble.indexOf(eventType) !== -1) {
    result = true
  }

  return result
}

export class DOMSource {
  constructor (rootElement$, namespace, isolateModule, delegators) {
    this._rootElement$ = rootElement$
    this._namespace = namespace
    this._isolateModule = isolateModule
    this._delegators = delegators
  }

  get elements () {
    if (this._namespace.length === 0) { return this._rootElement$ }

    const elementFinder =
      new ElementFinder(this._namespace, this._isolateModule)

    return this._rootElement$.map(el => elementFinder.call(el))
  }

  get namespace () {
    return this._namespace
  }

  select (selector) {
    if (typeof selector !== 'string') {
      throw new Error('DOM driver\'s select() expects the argument to be a ' +
        'string as a CSS selector')
    }

    const trimmedSelector = selector.trim()
    const childNamespace = trimmedSelector === ':root'
      ? this._namespace
      : this._namespace.concat(trimmedSelector)

    return new DOMSource(
      this._rootElement$, childNamespace,
      this._isolateModule, this._delegators)
  }

  events (eventType, options = {}) { // eslint-disable-line complexity
    if (typeof eventType !== 'string') {
      throw new Error('DOM driver\'s events() expects argument to be a ' +
        'string representing the event type to listen for.')
    }
    const useCapture = determineUseCapture(eventType, options)

    const namespace = this._namespace
    const scope = getScope(namespace)
    const key = scope
      ? `${eventType}~${useCapture}~${scope}`
      : `${eventType}~${useCapture}`

    const domSource = this

    let rootElement$
    if (scope) {
      let hadIsolatedMutable = false
      rootElement$ = this._rootElement$
        .filter(function filterScopedElements (rootElement) {
          const hasIsolated =
            !!domSource._isolateModule.getIsolatedElement(scope)
          const shouldPass = hasIsolated && !hadIsolatedMutable
          hadIsolatedMutable = hasIsolated
          return shouldPass
        })
    } else {
      rootElement$ = this._rootElement$.take(2)
    }

    return rootElement$
      .map(function setupEventDelegators (rootElement) { // eslint-disable-line complexity
        if (!namespace || namespace.length === 0) {
          return domEvent(eventType, rootElement, useCapture)
        }

        const delegators = domSource._delegators

        const top = scope
          ? domSource._isolateModule.getIsolatedElement(scope)
          : rootElement

        let delegator
        if (delegators.has(key)) {
          delegator = delegators.get(key)
          delegator.updateTopElement(top)
        } else {
          delegator = new EventDelegator(
            top, eventType, useCapture, domSource._isolateModule
          )
          delegators.set(key, delegator)
        }
        const stream = subject()

        if (scope) {
          domSource._isolateModule.addEventDelegator(scope, delegator)
        }

        delegator.addDestination(stream, namespace)

        return stream
      })
      .switch()
      .multicast()
  }

  dispose () {
    this._isolateModule.reset()
  }

  isolateSource (source, scope) {
    return isolateSource(source, scope)
  }

  isolateSink (sink, scope) {
    return isolateSink(sink, scope)
  }
}
