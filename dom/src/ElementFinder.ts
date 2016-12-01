import { ScopeChecker } from './ScopeChecker'
import { getScope, getSelectors, matchesSelector } from './util'
import { IsolateModule } from './modules/isolate'

function toElArray(input: any): Array<HTMLElement> {
  return Array.prototype.slice.call(input) as Array<HTMLElement>
}

export class ElementFinder {
  constructor (public namespace: Array<string>,
               public isolateModule: IsolateModule) {}

  call (rootElement: HTMLElement): HTMLElement | Array<HTMLElement> {
    const namespace = this.namespace
    if (namespace.join(``) === ``) {
      return [rootElement];
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
