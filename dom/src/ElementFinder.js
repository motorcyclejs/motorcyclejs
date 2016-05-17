import {ScopeChecker} from './ScopeChecker'
import {getScope, getSelectors, matchesSelector} from './util'

function toElementArray (nodeList) {
  const length = nodeList.length
  const arr = Array(length)

  for (let i = 0; i < length; ++i) {
    arr[i] = nodeList[i]
  }

  return arr
}

export class ElementFinder {
  constructor (namespace, isolateModule) {
    this.namespace = namespace
    this.isolateModule = isolateModule
  }

  call (rootElement) { // eslint-disable-line complexity
    const namespace = this.namespace
    if (namespace.join('') === '') { return rootElement }

    const scope = getScope(namespace)
    const selector = getSelectors(namespace)
    const scopeChecker = new ScopeChecker(scope, this.isolateModule)

    let topNode = rootElement
    let topNodeMatches = []

    if (scope.length > 0) {
      topNode = this.isolateModule.getIsolatedElement(scope) || rootElement
      if (selector && matchesSelector(topNode, selector)) {
        topNodeMatches[0] = topNode
      }
    }

    return toElementArray(topNode.querySelectorAll(selector))
      .filter(scopeChecker.isStrictlyInRootScope, scopeChecker)
      .concat(topNodeMatches)
  }
}
