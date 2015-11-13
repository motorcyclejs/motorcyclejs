import { run } from '@motorcycle/core';
import { makeDOMDriver, h } from '../../../src';
import most from 'most';
import map from 'fast.js/array/map';

// InputCount component
function InputCount( sources ) {
  const id = `.component-count`;
  const initialValue$ = sources.value$;
  const newValue$ = sources.DOM
    .select( id )
    .events( `input` )
    .map( ev => ev.target.value );
  const value$ = initialValue$.merge( newValue$ );

  return {
    DOM: value$.map(
      value => h( `input${id}`, {
        props: {
          type: `range`,
          max: `250`,
          min: `0`,
          value,
        },
        style: {
          width: `100%`,
        },
      })
    ),
    value$,
  };
}

// CycleJSLogo component
function CycleJSLogo( id ) {
  return {
    DOM: most.just(
      h( `div`, {
        style: {
          alignItems: `center`,
          background: `url(http://cycle.js.org/img/cyclejs_logo.svg)`,
          boxSizing: `border-box`,
          display: `inline-flex`,
          fontFamily: `sans-serif`,
          fontWeight: `700`,
          fontSize: `8px`,
          height: `32px`,
          justifyContent: `center`,
          margin: `8px`,
          width: `32px`,
        },
      }, `${id}` )
    ),
  };
}

function view( value, inputCountVTree, componentDOMs ) {
  return h( `div`, {}, [
    h( `h2`, {}, `# of Components: ${value}` ),
    inputCountVTree,
    h( `div`, {}, componentDOMs ),
  ]);
}

// Main
function Main( sources ) {
  const inputCount = InputCount({
    DOM: sources.DOM, value$: most.just( 100 ),
  });

  const components$ = inputCount.value$.map(
    value => most.combine(
      (...components) => components,
      ...map(
        Array(parseInt(value)),
        (v, i) => CycleJSLogo(i+1).DOM
      )
    )
  ).switch().skipRepeats();

  const view$ = most.combine(
    view,
    inputCount.value$,
    inputCount.DOM,
    components$
  ).skipRepeats();

  return {
    DOM: view$,
  };
}

run( Main, {
  DOM: makeDOMDriver( `#mocha` ),
});
