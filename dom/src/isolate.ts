import { Stream } from 'most'
import { VNode } from './interfaces'
import { SCOPE_PREFIX } from './util'
import { DOMSource } from './DOMSource'

export function isolateSource(source: DOMSource, scope: string): DOMSource {
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
