import {makeEventsSelector} from './events'
import {isolateSource, isolateSink} from './isolate'

function makeIsStrictlyInRootScope(namespace) {
  const classIsForeign = (c) => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) === -1
  }
  const classIsDomestic = (c) => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) !== -1
  }
  return function isStrictlyInRootScope(leaf) {
    const some = Array.prototype.some
    const split = String.prototype.split
    for (let el = leaf; el; el = el.parentElement) {
      const classList = el.classList || split.call(el.className, ` `)
      if (some.call(classList, classIsDomestic)) {
        return true
      }
      if (some.call(classList, classIsForeign)) {
        return false
      }
    }
    return true
  }
}

const isValidString = param => typeof param === `string` && param.length > 0

const contains = (str, match) => str.indexOf(match) > -1

const isNotTagName = param =>
    isValidString(param) && contains(param, `.`) ||
    contains(param, `#`) || contains(param, `:`)

function sortNamespace(a, b) {
  if (isNotTagName(a) && isNotTagName(b)) {
    return 0
  }
  return isNotTagName(a) ? 1 : -1
}

function removeDuplicates(arr) {
  const newArray = []
  arr.forEach((element) => {
    if (newArray.indexOf(element) === -1) {
      newArray.push(element)
    }
  })
  return newArray
}

const getScope = namespace =>
  namespace.filter(c => c.indexOf(`.cycle-scope`) > -1)

function makeFindElements(namespace) {
  return function findElements(rootElement) {
    if (namespace.join(``) === ``) {
      return rootElement
    }
    const slice = Array.prototype.slice

    const scope = getScope(namespace)
    // Uses global selector && is isolated
    if (namespace.indexOf(`*`) > -1 && scope.length > 0) {
      // grab top-level boundary of scope
      const topNode = rootElement.querySelector(scope.join(` `))
      // grab all children
      const childNodes = topNode.getElementsByTagName(`*`)
      return removeDuplicates([topNode].concat(slice.call(childNodes)))
        .filter(makeIsStrictlyInRootScope(namespace))
    }

    return removeDuplicates(
        slice.call(rootElement.querySelectorAll(namespace.join(` `)))
        .concat(slice.call(rootElement.querySelectorAll(namespace.join(``))))
      ).filter(makeIsStrictlyInRootScope(namespace))
  }
}

function makeElementSelector(rootElement$) {
  return function elementSelector(selector) {
    if (typeof selector !== `string`) {
      throw new Error(`DOM driver's select() expects the argument to be a ` +
        `string as a CSS selector`)
    }

    const namespace = this.namespace
    const trimmedSelector = selector.trim()
    const childNamespace = trimmedSelector === `:root` ?
      namespace :
      namespace.concat(trimmedSelector).sort(sortNamespace)

    return {
      observable: rootElement$.map(makeFindElements(childNamespace)),
      namespace: childNamespace,
      select: makeElementSelector(rootElement$),
      events: makeEventsSelector(rootElement$, childNamespace),
      isolateSource,
      isolateSink,
    }
  }
}

export {makeElementSelector, makeIsStrictlyInRootScope}
