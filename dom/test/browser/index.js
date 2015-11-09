/* global describe, it, beforeEach */
import assert from 'assert';
import { run } from '@motorcycle/core';
import { makeDOMDriver, h } from '../../src';
import most from 'most';

function createRenderTarget( id = null ) {
  let element = document.createElement(`div`);
  element.className = `cycletest`;
  if (id) {
    element.id = id;
  }
  document.body.appendChild(element);
  return element;
}

describe(`Rendering`, () => {
  describe(`makeDomDriver`, () => {
    it(`should accept a DOM element as input`, () => {
      assert.doesNotThrow(() => makeDOMDriver( createRenderTarget() ) );
    });

    it(`should accept a DocumentFragment as input`, () => {
      let element = document.createDocumentFragment();
      assert.doesNotThrow(() => makeDOMDriver( element ) );
    });

    it(`should accept a string selection to an existing element as input`, () => {
      let id = `testShouldAcceptSelectorToExisting`;
      let element = createRenderTarget( id );
      assert.doesNotThrow( () => makeDOMDriver( `#${id}` ) );
    });
  });

  describe(`DOM Driver`, () => {
    it('should throw if input is not an Observable<VTree>', function () {
      let domDriver = makeDOMDriver(createRenderTarget());
      assert.throws(function () {
        domDriver({});
      }, /The DOM driver function expects as input an Observable of virtual/);
    });

    it('should have Observable `:root` in response', function (done) {
      function app() {
        return {
          DOM: most.just(
            h('div.top-most', [
              h('p', 'Foo'),
              h('span', 'Bar')
            ])
          )
        };
      }
      let [sinks, sources] = run(app, {
        DOM: makeDOMDriver(createRenderTarget(`fuckThisTest`))
      });

      sources.DOM.select(':root').observable.forEach(root => {
        let classNameRegex = /top\-most/;
        assert.strictEqual(root.tagName, 'DIV');
        let child = root.children[0];
        assert.notStrictEqual(classNameRegex.exec(child.className), null);
        assert.strictEqual(classNameRegex.exec(child.className)[0], 'top-most');
        done();
      });
    });
  });
  it('should catch interactions coming from wrapped view', done => {
    const app = () => ({
      DOM: most.just(
          h('h3.myelementclass', {}, 'Foobar')
      )
    });

    const [sinks, sources] = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.myelementclass').events('click').observe(ev => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual(ev.target.textContent, 'Foobar')
      done();
    });

    sources.DOM.select(':root').observable.observe(root => {
      let myElement = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(() => {
        console.log( myElement );
        myElement.click()
      });
    });
  })
});
