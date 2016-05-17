import {SCOPE_PREFIX} from '../util'

export function isolateSource (source, scope) {
  return source.select(SCOPE_PREFIX + scope)
}

export function isolateSink (sink, scope) {
  return sink.tap(vTree => { vTree.data.isolate = SCOPE_PREFIX + scope })
}
