import Most from 'most';
import snabbdom from 'snabbdom';
import h from 'snabbdom/h';
import { getDomElement } from './utils';
import fromEvent from './fromEvent';
import parseTree from './parseTree';

import forEach from 'fast.js/array/forEach';

function makeEventsSelector( element$ ) {
  return function events( eventName, useCapture = false ) {
    if ( typeof eventName !== `string` ) {
      throw new Error( `DOM driver's events() expects argument to be a ` +
        `string representing the event type to listen for.` );
    }
    return element$.flatMap( element => {
      if ( !element ) {
        return Most.empty();
      }
      return Most.create( add => {
        if ( element.length ) {
          forEach(element, el => { // eslint-disable-line
            Most.fromEvent( eventName, el, useCapture ).observe( add );
          });
        } else {
          fromEvent( eventName, element, useCapture ).observe( add );
        }
      });
    });
  };
}

function makeElementSelector( rootElem$ ) {
  return function select( selector ) {
    if ( typeof selector !== `string` ) {
      throw new Error( `DOM driver's select() expects first argument to be a ` +
        `string as a CSS selector` );
    }
    let element$ = selector.trim() === `:root` ? rootElem$ :
      rootElem$.map( rootElem => {
        return rootElem.querySelectorAll( selector );
      });
    return {
      observable: element$,
      events: makeEventsSelector( element$ ),
    };
  };
}

function validateDOMDriverInput( view$ ) {
  if ( !view$ || typeof view$.observe !== `function` ) {
    throw new Error( `The DOM driver function expects as input an ` +
      `Observable of virtual DOM elements` );
  }
}

function makeDOMDriver( container, modules = [
  require( `snabbdom/modules/class` ),
  require( `snabbdom/modules/props` ),
  require( `snabbdom/modules/attributes` ),
  require( `snabbdom/modules/style` ),
]) {
  const patch = snabbdom.init( modules );
  const rootElem = getDomElement( container );
  const renderContainer = document.createElement( `div` );

  return function DOMDriver( view$ ) {
    validateDOMDriverInput( view$ );

    const transposedView$ = view$
      .flatMap( parseTree );

    const rootElem$ = Most.create( add => {
      transposedView$
        .loop( ( buffer, x ) => {
          buffer.push( x ) ;
          if ( buffer[0] === rootElem ) {
            if ( rootElem.hasChildNodes() ) {
              rootElem.innerHTML = ``;
            }
            rootElem.appendChild( renderContainer );
            buffer.shift();
          }
          const pair = buffer.slice( -2 );
          patch( ...pair );
          return { seed: pair, value: pair };
        }, [ rootElem, renderContainer ]).observe( pair => {
          add( rootElem );
          return pair;
        });
    });

    return {
      select: makeElementSelector( rootElem$ ),
    };
  };
}

export { makeDOMDriver, h };
