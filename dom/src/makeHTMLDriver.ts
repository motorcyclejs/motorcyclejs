declare const require: (package: string) => any
import { VNode } from './interfaces'
import { Stream } from 'most'
import { transposeVNode } from './transposition'
import { HTMLSource } from './HTMLSource'
const toHTML: (vnode: VNode) => string = require('snabbdom-to-html')

export interface HTMLDriverOptions {
  transposition?: boolean
}

export type EffectCallback = (html: string) => any
/* tslint:disable:no-empty */
const noop = () => {}
/* tslint:enable:no-empty */

export function makeHTMLDriver(effect: EffectCallback, options?: HTMLDriverOptions) {
  if (!options) { options = {} }
  const transposition = options.transposition || false
  return function htmlDriver(vnode$: Stream<VNode>): HTMLSource {
    const preprocessedVNode$ = (
      transposition ? vnode$.map(transposeVNode).switch() : vnode$
    )
    const html$ = preprocessedVNode$.map(toHTML)
    html$.subscribe({
      next: effect || noop,
      error: noop,
      complete: noop,
    })
    return new HTMLSource(html$)
  }
}
