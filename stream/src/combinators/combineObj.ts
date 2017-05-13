import { Stream } from '@most/types'
import { combineArray } from '@most/core'

export function combineObj<A>(obj: any): Stream<A> {
  const keys: ReadonlyArray<string> = Object.keys(obj)
  const keysCount: number = keys.length

  const sources: Array<any> = new Array(keysCount)
  const sanitizedKeys: Array<any> = new Array(keysCount)

  let i = 0
  for (; i < keysCount; ++i) {
    sanitizedKeys[i] = keys[i].replace(/\$$/, ``)
    sources[i] = obj[keys[i]]
  }

  return combineArray<any, A>((...args) => {
    const combination: any = {}

    for (i = 0; i < keysCount; ++i)
      combination[sanitizedKeys[i]] = args[i]

    return combination
  }, sources)
}
