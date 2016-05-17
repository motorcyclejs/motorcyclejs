import {fromPromise, empty} from 'most'
import toHtml from 'snabbdom-to-html'

import {transposeVNode} from './transposition'

class HTMLSource {
  constructor (vNode$) {
    this._html$ = fromPromise(vNode$.reduce((_, x) => x, void 0)).map(toHtml)
  }

  get elements () {
    return this._html$
  }

  select () {
    return new HTMLSource(empty())
  }

  events () {
    return empty()
  }
}

export function makeHTMLDriver (options = {}) {
  const transposition = options.transposition || false
  return function htmlDriver (vNode$) {
    const preprocessedVNode$ = transposition
      ? vNode$.map(transposeVNode).switch()
      : vNode$
    return new HTMLSource(preprocessedVNode$)
  }
}
