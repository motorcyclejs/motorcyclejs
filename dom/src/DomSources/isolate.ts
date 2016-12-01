import { Stream } from 'most'
import { VNode } from 'snabbdom-ts'
import { SCOPE_PREFIX } from '../util'
import { DomSource } from './DomSource'

export function isolateSource(source: DomSource, scope: string): DomSource {
  return source.select(SCOPE_PREFIX + scope)
}

export function isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode> {
  return sink.map((vTree: VNode) => {
    if ((vTree.data as any).isolate) {
      const existingScope =
        parseInt((vTree.data as any).isolate.split(SCOPE_PREFIX + 'cycle')[1])

      const _scope = parseInt(scope.split('cycle')[1])

      if (isNaN(existingScope) || isNaN(_scope) || existingScope > _scope) {
        return vTree
      }
    }
    (vTree.data as any).isolate = SCOPE_PREFIX + scope
    if (typeof vTree.key === 'undefined') {
      vTree.key = SCOPE_PREFIX + scope
    }
    return vTree
  })
}
