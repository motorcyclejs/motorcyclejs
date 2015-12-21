import { run } from '@motorcycle/core'
import { makeDomDriver, input, div, h2 } from '../../../src'
import most from 'most'
import map from 'fast.js/array/map'

const InputCount =
  sources => {
    const id = `.component-count`
    const value$ =
      sources.DOM
        .select(id)
        .events(`input`)
        .map(ev => ev.target.value)
        .merge(sources.value$)

    return {
      value$
      , DOM: value$.map(
        value => input(
          `${id}`
          , {
              props: {
                type: `range`
                , max: `250`
                , min: `0`
                , value
                ,
              }
            , style: {
                width: `100%`
                ,
              }
            ,
          }
        )
      )
    }
  }

const CycleJSLogo =
  id => ({
    DOM: most.just(
      div({
        style: {
          alignItems: `center`
          , background: `url(http://cycle.js.org/img/cyclejs_logo.svg)`
          , boxSizing: `border-box`
          , display: `inline-flex`
          , fontFamily: `sans-serif`
          , fontWeight: `700`
          , fontSize: `8px`
          , height: `32px`
          , justifyContent: `center`
          , margin: `8px`
          , width: `32px`
        }
      }
      , [
        id
      ])
    )
  })

const view =
  (value, inputCountVTree, componentDOMs) =>
    div([
      h2([`# of Components: ${value}`])
      , inputCountVTree
      , div(componentDOMs)
    ])

const Main =
  sources => {
    const inputCount = InputCount({
      DOM: sources.DOM
      , value$: most.just(100)
    })

    const components$ =
      inputCount
        .value$
        .map(
          value =>
          most.combine(
            (...components) => components
            , ...map(
              Array(parseInt(value))
              , (v, i) => CycleJSLogo(i+1).DOM
            )
          )
        )
          .switch()
          .skipRepeats()

    const view$ =
      most.combine(
        view
        , inputCount.value$
        , inputCount.DOM
        , components$
      )
        .skipRepeats()

    return {
      DOM: view$
    }
  }

run(Main, {DOM: makeDomDriver(`#mocha`)});
