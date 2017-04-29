import { get } from '../helpers'

export function disposeSources<Sources>(sources: Sources) {
  Object.keys(sources)
    .forEach(function disposeSource(sourceName: string) {
      const source = get(sources, sourceName)

      return source.dispose && source.dispose()
    })
}
