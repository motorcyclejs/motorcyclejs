export class ScopeChecker {
  constructor (scope, isolateModule) {
    this.scope = scope
    this.isolateModule = isolateModule
  }

  isStrictlyInRootScope (leaf) { // eslint-disable-line complexity
    for (let el = leaf; el; el = el.parentElement) {
      const scope = this.isolateModule.isIsolatedElement(el)
      if (scope && scope !== this.scope) {
        return false
      }
      if (scope) {
        return true
      }
    }
    return true
  }
}
