import { ScopeChecker } from './ScopeChecker'
import { getScope, getSelectors } from './util'
import { IsolateModule } from './modules/isolate'

interface MatchesSelector {
  (element: HTMLElement, selector: string): boolean
}
let matchesSelector: MatchesSelector;
declare var require: any
try {
  matchesSelector = require(`matches-selector`)
} catch (e) {
  matchesSelector = Function.prototype as MatchesSelector
}

function toElArray(input: any): Array<HTMLElement> {
  return Array.prototype.slice.call(input) as Array<HTMLElement>
}

export class ElementFinder {
  constructor (public namespace: Array<string>,
               public isolateModule: IsolateModule) {}

  call (rootElement: HTMLElement): HTMLElement | Array<HTMLElement> {
    const namespace = this.namespace
    if (namespace.join(``) === ``) {
      return rootElement
    }

    const scope = getScope(namespace)
    const scopeChecker = new ScopeChecker(scope, this.isolateModule)
    const selector = getSelectors(namespace)
    let topNode = rootElement
    let topNodeMatches: Array<HTMLElement> = []

    if (scope.length > 0) {
      topNode = this.isolateModule.getIsolatedElement(scope) || rootElement
      if (selector && matchesSelector(topNode, selector)) {
        topNodeMatches.push(topNode)
      }
    }

    return toElArray(topNode.querySelectorAll(selector))
      .filter(scopeChecker.isStrictlyInRootScope, scopeChecker)
      .concat(topNodeMatches)
  }
}
