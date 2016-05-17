import {run} from '@motorcycle/core'
import {makeDOMDriver, h, modules} from '../../src'
const {PropsModule, StyleModule} = modules
import {zip} from 'most'

function map (arr, fn) {
  const l = arr.length
  const mappedArr = Array(l)
  for (let i = 0; i < l; ++i) {
    mappedArr[i] = fn(arr[i], i)
  }
  return mappedArr
}

function InputCount (dom, initialValue) {
  const id = '.component-count'
  const value$ = dom.select(id)
      .events('input')
      .map(ev => ev.target.value)
      .startWith(initialValue)
      .multicast()

  return {
    dom: value$.map(value => h(`input${id}`, {
      key: 1000,
      props: {
        type: 'range',
        max: 250,
        min: 1,
        value
      },
      style: {
        width: '100%'
      }
    })),
    value$
  }
}

function CycleJSLogo (id) {
  return h('div', {
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
  }, `${id}`)
}

function view (value, inputCountVTree, componentDOMs) {
  return h('div', {static: true}, [
    h('h2', [`# of Components: ${value}`]),
    inputCountVTree,
    h('div', componentDOMs)
  ])
}

function main (sources) {
  const initialValue = 100
  const inputCount = InputCount(sources.dom, initialValue)

  const components$ = inputCount.value$
    .map(value => map(Array(parseInt(value)), (v, i) => CycleJSLogo(i + 1)))

  return {
    dom: zip(view, inputCount.value$, inputCount.dom, components$)
  }
}

run(main, { dom: makeDOMDriver('#test-container', {modules: [
  PropsModule, StyleModule
]}) })
