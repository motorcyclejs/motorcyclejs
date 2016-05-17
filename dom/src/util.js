let matchesSelector
try {
  matchesSelector = require('matches-selector')
} catch (e) {
  matchesSelector = Function.prototype
}

export {matchesSelector}

function isElement (obj) { // eslint-disable-line complexity
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement || obj instanceof DocumentFragment // eslint-disable-line
    : obj && typeof obj === 'object' && obj !== null &&
      (obj.nodeType === 1 || obj.nodeType === 11) &&
      typeof obj.nodeName === 'string'
}

export const SCOPE_PREFIX = '$$CYCLEDOM$$-'

export function getElement (selectors) { // eslint-disable-line complexity
  const domElement = typeof selectors === 'string'
    ? document.querySelector(selectors)
    : selectors

  if (typeof selectors === 'string' && domElement === null) {
    throw new Error(`Cannot render into unknown element '${selectors}'`)
  } else if (!isElement(domElement)) {
    throw new Error('Given container is not a DOM element neither a ' +
      'selector string.')
  }
  return domElement
}

export function getScope (namespace) {
  return namespace
    .filter(c => c.indexOf(SCOPE_PREFIX) > -1)
    .slice(-1) // only need the latest, most specific, isolated boundary
    .join('')
}

export function getSelectors (namespace) {
  return namespace.filter(c => c.indexOf(SCOPE_PREFIX) === -1).join(' ')
}

export const eventTypesThatDontBubble = [
  'load',
  'unload',
  'focus',
  'blur',
  'mouseenter',
  'mouseleave',
  'submit',
  'change',
  'reset',
  'timeupdate',
  'playing',
  'waiting',
  'seeking',
  'seeked',
  'ended',
  'loadedmetadata',
  'loadeddata',
  'canplay',
  'canplaythrough',
  'durationchange',
  'play',
  'pause',
  'ratechange',
  'volumechange',
  'suspend',
  'emptied',
  'stalled',
  'scroll'
]
