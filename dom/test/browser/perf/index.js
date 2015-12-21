import { run } from '@motorcycle/core'
import { makeDomDriver, input, div, h2 } from '../../../src'
import most from 'most'
import map from 'fast.js/array/map'

function InputCount(dom) {
  const id = `.component-count`
  const value$ = dom.select(id)
      .events(`input`)
      .map(ev => ev.target.value)
      .startWith(100)
      .skipRepeats()

  return {
    dom: value$.map(value => input(id, {
      props: {
        type: 'range',
        max: 250,
        min: 1,
        value,
      },
      style: {
        width: '100%'
      }
    })),
    value$
  }
}

function CycleJSLogo(id) {
  return {
    dom: most.just(div({
      key: id,
      style: {
        alignItems: 'center',
        background: 'url(./cyclejs_logo.svg)',
        boxSizing: 'border-box',
        display: 'inline-flex',
        fontFamily: 'sans-serif',
        fontWeight: '700',
        fontSize: '8px',
        height: '32px',
        justifyContent: 'center',
        margin: '8px',
        width: '32px'
      }
    }, `${id}`))
  }
}

function view(value, inputCountVTree, componentDOMs) {
  return div([
    h2([`# of Components: ${value}`]),
    inputCountVTree,
    div(componentDOMs)
  ])
}

function Main(sources) {
  const inputCount = InputCount(sources.dom)

  const components$ = inputCount.value$
    .map(value => most.combine(
      (...components) => components,
      ...map(Array(parseInt(value)), (v, i) => CycleJSLogo(i+1).dom)
    ))
    .switch()

  const view$ =
    most.combine(view, inputCount.value$, inputCount.dom, components$)

  return {dom: view$}
}

run(Main, {dom: makeDomDriver(`#test-container`, [
  require('snabbdom/modules/props'),
  require('snabbdom/modules/style')
])});
