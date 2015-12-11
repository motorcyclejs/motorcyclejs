import most from 'most'
import snabbdom from 'snabbdom'
import h from 'snabbdom/h'
const {
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video,
} = require(`hyperscript-helpers`)(h)
let matchesSelector
try {
  matchesSelector = require(`matches-selector`)
} catch (e) {
  matchesSelector = () => {}
}
import fastMap from 'fast.js/array/map'
import reduce from 'fast.js/array/reduce'
import filter from 'fast.js/array/filter'

import {getDomElement} from './utils'
import fromEvent from './fromEvent'
import parseTree from './parseTree'

const isolateSource =
  (_source, _scope) =>
    _source.select(`.cycle-scope-${_scope}`)

const isolateSink =
  (sink, scope) =>
    sink.map(
      vtree => {
        if (vtree.sel.indexOf(`cycle-scope-${scope}`) === -1) {
          const c = `${vtree.sel}.cycle-scope-${scope}`
          vtree.sel = c
        }
        return vtree
      }
    )

const makeIsStrictlyInRootScope =
  (rootList, namespace) =>
    leaf => {
      const classIsForeign =
        c => {
          const matched = c.match(/cycle-scope-(\S+)/)
          return matched && namespace.indexOf(`.${c}`) === -1
        }

      for (let el = leaf.parentElement; el !== null; el = el.parentElement) {
        if (rootList.indexOf(el) >= 0) {
          return true
        }
        const classList = el.className.split(` `)
        if (classList.some(classIsForeign)) {
          return false
        }
      }
      return true
    }

const makeEventsSelector =
  element$ =>
    (eventName, useCapture = false) => {
      if (typeof eventName !== `string`) {
        throw new Error(`DOM drivers events() expects argument to be a ` +
          `string representing the event type to listen for.`)
      }
      return element$
        .map(elements => {
          if (!elements) {
            return most.empty()
          }
          return fromEvent(eventName, elements, useCapture)
        }).switch().multicast()
    }

// Use function not 'const = x => {}' for this.namespace below
function makeElementSelector(rootElem$) {
  return function DOMSelect(selector) {
    if (typeof selector !== `string`) {
      throw new Error(`DOM drivers select() expects first argument to be a ` +
        `string as a CSS selector`)
    }
    const namespace = this.namespace
    const scopedSelector = `${namespace.join(` `)} ${selector}`.trim()
    const element$ =
      selector.trim() === `:root` ?
        rootElem$ :
        rootElem$.map(
          x => {
            const array = Array.isArray(x) ? x : [x]
            return filter(
              reduce(
                fastMap(
                  array,
                  element => {
                    if (matchesSelector(element, scopedSelector)) {
                      return [element]
                    } else {
                      let nodeList = element.querySelectorAll(scopedSelector)
                      const nodeListArray = new Array(nodeList.length)
                      for (let j = 0; j < nodeListArray.length; j++) {
                        nodeListArray[j] = nodeList[j]
                      }
                      return nodeListArray
                    }
                  }
                ),
                (prev, curr) => prev.concat(curr),
                []
              ),
              makeIsStrictlyInRootScope(array, namespace)
            )
          }
      )
    return {
      observable: element$,
      namespace: namespace.concat(selector),
      select: makeElementSelector(element$),
      events: makeEventsSelector(element$),
      isolateSource,
      isolateSink,
    }
  }
}

const validateDOMDriverInput =
  view$ => {
    if (!view$ || typeof view$.observe !== `function`) {
      throw new Error(`The DOM driver function expects as input an ` +
        `Observable of virtual DOM elements`)
    }
  }

const makeDOMDriver =
  (container, modules = [
    require(`snabbdom/modules/class`),
    require(`snabbdom/modules/props`),
    require(`snabbdom/modules/attributes`),
    require(`snabbdom/modules/style`),
  ]) => {
    const patch = snabbdom.init(modules)
    const rootElem = getDomElement(container)

    const DOMDriver =
      view$ => {
        validateDOMDriverInput(view$)

        const rootElem$ =
          most.create(
            add =>
              view$
                .flatMap(parseTree)
                .reduce(
                  (prevView, newView) => {
                    patch(prevView, newView)
                    add(newView.elm)
                    return newView
                  }
                  , rootElem
                )
          )
        rootElem$.drain()

        return {
          namespace: [],
          select: makeElementSelector(rootElem$),
          isolateSink,
          isolateSource,
        }
      }

    return DOMDriver
  }

export {
  makeDOMDriver,
  h,
  a, abbr, address, area, article, aside, audio, b, base,
  bdi, bdo, blockquote, body, br, button, canvas, caption,
  cite, code, col, colgroup, dd, del, dfn, dir, div, dl,
  dt, em, embed, fieldset, figcaption, figure, footer, form,
  h1, h2, h3, h4, h5, h6, head, header, hgroup, hr, html,
  i, iframe, img, input, ins, kbd, keygen, label, legend,
  li, link, map, mark, menu, meta, nav, noscript, object,
  ol, optgroup, option, p, param, pre, q, rp, rt, ruby, s,
  samp, script, section, select, small, source, span, strong,
  style, sub, sup, table, tbody, td, textarea, tfoot, th,
  thead, title, tr, u, ul, video
}
