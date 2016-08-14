import { VNode, Module } from '../interfaces'
import { EventDelegator } from '../EventDelegator'

export class IsolateModule {
  private eventDelegators = new Map<string, Array<EventDelegator>>()
  constructor (private isolatedElements: Map<string, HTMLElement>) {
  }

  private setScope (elm: HTMLElement, scope: string) {
    this.isolatedElements.set(scope, elm)
  }

  private removeScope (scope: string) {
    this.isolatedElements.delete(scope)
  }

  getIsolatedElement (scope: string) {
    return this.isolatedElements.get(scope)
  }

  isIsolatedElement (elm: Element): string | boolean {
    let iterator = this.isolatedElements.entries()
    let hasNext = true
    while (hasNext) {
      try {
        const result = iterator.next()
        const [scope, element] = result.value
        if (elm === element) {
          return scope
        }
      } catch (err) {
        hasNext = false
      }
    }
    return false
  }

  addEventDelegator (scope: string, eventDelegator: EventDelegator) {
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

  createModule (): Module {
    const self = this
    return {
      create (oldVNode: VNode, vNode: VNode) {
        const {data: oldData = {}} = oldVNode
        const {elm, data = {}} = vNode
        const oldScope = (oldData as any).isolate || ``
        const scope = (data as any).isolate || ``
        if (scope) {
          if (oldScope) { self.removeScope(oldScope) }
          self.setScope(elm as HTMLElement, scope)
          const delegators = self.eventDelegators.get(scope)
          if (delegators) {
            for (let i = 0, len = delegators.length; i < len; ++i) {
              delegators[i].updateTopElement(<HTMLElement> elm)
            }
          } else if (delegators === void 0) {
            self.eventDelegators.set(scope, [])
          }
        }
        if (oldScope && !scope) {
          self.removeScope(scope)
        }
      },

      update (oldVNode: VNode, vNode: VNode) {
        const {data: oldData = {}} = oldVNode
        const {elm, data = {}} = vNode
        const oldScope = (oldData as any).isolate || ``
        const scope = (data as any).isolate || ``
        if (scope && scope !== oldScope) {
          if (oldScope) { self.removeScope(oldScope) }
          self.setScope(elm as HTMLElement, scope)
        }
        if (oldScope && !scope) {
          self.removeScope(scope)
        }
      },

      remove ({ data }: VNode, cb: Function) {
        data = data || {}
        const scope = (<any> data).isolate
        if (scope) {
          self.removeScope(scope)
          if (self.eventDelegators.get(scope)) {
            self.eventDelegators.set(scope, [])
          }
        }
        cb()
      },

      destroy({ data }: VNode) {
        data = data || {}
        const scope = (data as any).isolate
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
