export class IsolateModule {
  constructor (isolatedElements) {
    this.isolatedElements = isolatedElements
    this.eventDelegators = new Map([])
  }

  setScope (elm, scope) {
    this.isolatedElements.set(scope, elm)
  }

  removeScope (scope) {
    this.isolatedElements.delete(scope)
  }

  getIsolatedElement (scope) {
    return this.isolatedElements.get(scope)
  }

  isIsolatedElement (elm) {
    const elements = Array.from(this.isolatedElements.entries())

    for (let i = 0; i < elements.length; ++i) {
      if (elm === elements[i][1]) {
        return elements[i][0]
      }
    }
    return false
  }

  addEventDelegator (scope, eventDelegator) {
    let delegators = this.eventDelegators.get(scope)
    if (!delegators) {
      delegators = []
      this.eventDelegators.set(scope, delegators)
    }
    delegators[delegators.length] = eventDelegator
  }

  reset () {
    this.isolatedElements.clear()
  }

  createModule () {
    const self = this
    return {
      create (oldVNode, vNode) { // eslint-disable-line complexity
        const {data: oldData = {}} = oldVNode
        const {elm, data = {}} = vNode
        const oldScope = oldData.isolate || ''
        const scope = data.isolate || ''
        if (scope) {
          if (oldScope) { self.removeScope(oldScope) }
          self.setScope(elm, scope)
          const delegators = self.eventDelegators.get(scope)
          if (delegators) {
            for (let i = 0, len = delegators.length; i < len; ++i) {
              delegators[i].updateTopElement(elm)
            }
          } else if (delegators === void 0) {
            self.eventDelegators.set(scope, [])
          }
        }
        if (oldScope && !scope) {
          self.removeScope(scope)
        }
      },

      update (oldVNode, vNode) { // eslint-disable-line complexity
        const {data: oldData = {}} = oldVNode
        const {elm, data = {}} = vNode
        const oldScope = oldData.isolate || ''
        const scope = data.isolate || ''
        if (scope) {
          if (oldScope) { self.removeScope(oldScope) }
          self.setScope(elm, scope)
        }
        if (oldScope && !scope) {
          self.removeScope(scope)
        }
      },

      remove ({data = {}}, cb) {
        const scope = data.isolate
        if (scope) {
          self.removeScope(scope)
          if (self.eventDelegators.get(scope)) {
            self.eventDelegators.set(scope, [])
          }
        }
        cb()
      },

      destroy ({data = {}}) {
        const scope = data.isolate
        if (scope) {
          self.removeScope(scope)
          if (self.eventDelegators.get(scope)) {
            self.eventDelegators.set(scope, [])
          }
        }
      }
    }
  }
}
