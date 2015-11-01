import Most from 'most';
import CompoundDisposable from 'most/lib/disposable/CompoundDisposable';
import Disposable from 'most/lib/disposable/Disposable';

function createListener({ element, eventName, handler, useCapture }) {
  if ( element.addEventListener ) {
    element.addEventListener( eventName, handler, useCapture );
    return new Disposable( function removeEventListener() {
      element.removeEventListener( eventName, handler, useCapture );
    }, {});
  }
  throw new Error( `No listener found` );
}

function createEventListener({ element, eventName, handler, useCapture }) {
  const disposables = new CompoundDisposable();

  const toStr = Object.prototype.toString;
  if ( toStr.call( element ) === `[object NodeList]` ||
    toStr.call( element ) === `[object HTMLCollection]` )
  {
    for ( let i = 0, len = element.length; i < len; i++ ) {
      disposables.disposables.push( createEventListener({
          element: element.item( i ),
          eventName,
          handler,
          useCapture }) );
    }
  } else if ( element ) {
    disposables.disposables
      .push( createListener({ element, eventName, handler, useCapture }) );
  }
  return () => { disposables.dispose(); };
}

function fromEvent( element, eventName, useCapture = false ) {
  return Most.create( add => {
    return createEventListener({
      element,
      eventName,
      handler: function handler() {
        add( arguments[0]);
      },
      useCapture });
  });
}

export default fromEvent;
