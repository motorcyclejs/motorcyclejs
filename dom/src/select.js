import makeEventsSelector from './events'
import {isolateSink, isolateSource} from './isolate'

import {filter, concat} from 'fast.js/array'

function makeIsStrictlyInRootScope(namespace) {
  const classIsForeign = c => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) === -1
  }
  const classIsDomestic = c => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) !== -1
  }
  return function isStrictlyInRootScope(leaf) {
    for (let el = leaf; el !== null; el = el.parentElement) {
      const split = String.prototype.split
      const classList = el.classList || split.call(el.className, ` `)
      if (Array.prototype.some.call(classList, classIsDomestic)) {
        return true
      }
      if (Array.prototype.some.call(classList, classIsForeign)) {
        return false
      }
    }
    return true
  }
}

function makeElementSelector(rootElem$) {
  return function DOMSelect(selector) {
    if (typeof selector !== `string`) {
      throw new Error(`DOM drivers select() expects first argument to be a ` +
        `string as a CSS selector`)
    }
    const namespace = this.namespace
    const scopedSelector = concat(
      namespace,
      selector.trim() === `:root` ? `` : selector.trim()
    )
    return {
      observable: rootElem$.map(rootEl => {
        if (scopedSelector.join(``) === ``) {
          return rootEl
        }
        let nodeList = rootEl.querySelectorAll(scopedSelector.join(` `).trim())
        if (nodeList.length === 0) {
          nodeList = rootEl.querySelectorAll(scopedSelector.join(``))
        }
        const array = Array.prototype.slice.call(nodeList)
        return filter(array, makeIsStrictlyInRootScope(scopedSelector))
      }),
      namespace: namespace.concat(selector),
      select: makeElementSelector(rootElem$),
      events: makeEventsSelector(rootElem$, scopedSelector),
      isolateSource,
      isolateSink,
    }
  }
}

export default makeElementSelector
export {makeIsStrictlyInRootScope}
