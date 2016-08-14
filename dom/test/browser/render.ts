/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import * as most from 'most'
import { createRenderTarget, interval } from '../helpers'
import { div, h2, select, option, h4, svg, p, thunk, makeDOMDriver } from '../../src/index'

describe('DOM Rendering', function () {
  it('should render DOM elements even when DOMSource is not utilized', function (done) {
    function main() {
      return {
        DOM: most.of(
          div('.my-render-only-container', [
            h2('Cycle.js framework')
          ])
        )
      };
    }

    Cycle.run(main, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    setTimeout(() => {
      const myContainer = document.querySelector('.my-render-only-container');
      assert.notStrictEqual(myContainer, null);
      assert.notStrictEqual(typeof myContainer, 'undefined');
      assert.strictEqual(myContainer.tagName, 'DIV');
      const header = myContainer.querySelector('h2');
      assert.notStrictEqual(header, null);
      assert.notStrictEqual(typeof header, 'undefined');
      assert.strictEqual(header.textContent, 'Cycle.js framework');
      done();
    }, 150);
  });

  it('should convert a simple virtual-dom <select> to DOM element', function (done) {
    function app() {
      return {
        DOM: most.of(select('.my-class', [
          option({ props: { value: 'foo' } }, 'Foo'),
          option({ props: { value: 'bar' } }, 'Bar'),
          option({ props: { value: 'baz' } }, 'Baz')
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const selectEl = root.querySelector('.my-class');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'SELECT');
      setTimeout(() => {
        dispose();
        done();
      });
    });
    dispose = run();
  });

  // TODO: Figure out JSX example 

  it('should give elements as a value-over-time', function (done) {
    function app() {
      return {
        DOM: most.of(h2('.value-over-time', 'Hello test'))
          .merge(most.never())
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    let firstSubscriberRan = false;
    let secondSubscriberRan = false;

    const element$ = sources.DOM.select(':root').elements();

    element$.skip(1).observe(function (root: HTMLElement) {
      assert.strictEqual(firstSubscriberRan, false);
      firstSubscriberRan = true;
      const header = root.querySelector('.value-over-time');
      assert.notStrictEqual(header, null);
      assert.notStrictEqual(typeof header, 'undefined');
      assert.strictEqual(header.tagName, 'H2');
    });

    setTimeout(() => {
      element$.observe(function (root: HTMLElement) {
        assert.strictEqual(secondSubscriberRan, false);
        secondSubscriberRan = true;
        const header = root.querySelector('.value-over-time');
        assert.notStrictEqual(header, null);
        assert.notStrictEqual(typeof header, 'undefined');
        assert.strictEqual(header.tagName, 'H2');
        setTimeout(() => {
          dispose();
          done();
        });
      });
    }, 100);
    dispose = run();
  });

  it('should allow snabbdom Thunks in the VTree', function (done) {
    function renderThunk(greeting: string) {
      return h4('Constantly ' + greeting)
    }

    // The Cycle.js app
    function app() {
      return {
        DOM: interval(10).take(5).map(() =>
          div([
            thunk('h4', 'key1', renderThunk, ['hello' + 0])
          ])
        )
      };
    }

    // Run it
    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Assert it
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const selectEl = root.querySelector('h4');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'H4');
      assert.strictEqual(selectEl.textContent, 'Constantly hello0');
      dispose();
      done();
    });
    dispose = run();
  });

  it('should render embedded HTML within SVG <foreignObject>', function (done) {
    const thisBrowserSupportsForeignObject = document.implementation
      .hasFeature('www.http://w3.org/TR/SVG11/feature#Extensibility', '1.1');

    function app() {
      if (!thisBrowserSupportsForeignObject) {
        done()
      }
      return {
        DOM: most.of(
          svg({ attrs: { width: 150, height: 50 }}, [
            svg.foreignObject({ attrs: { width: '100%', height: '100%' }}, [
              p('.embedded-text', 'This is HTML embedded in SVG')
            ])
          ])
        )
      }
    }

    // Run it
    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;

    // Make assertions
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const embeddedHTML = root.querySelector('p.embedded-text');

      assert.strictEqual(embeddedHTML.namespaceURI, 'http://www.w3.org/1999/xhtml');
      assert.notStrictEqual(embeddedHTML.clientWidth, 0);
      assert.notStrictEqual(embeddedHTML.clientHeight, 0);

      setTimeout(() => {
        dispose();
        done();
      });
    });

    dispose = run();
  });

  it('should filter out null/undefined children', function (done) {
    // The Cycle.js app
    function app() {
      return {
        DOM: interval(10).take(5).map(() =>
          div('.parent', [
            'Child 1',
            null,
            h4('.child3', [
              null,
              'Grandchild 31',
              div('.grandchild32', [
                null,
                'Great grandchild 322'
              ])
            ]),
            undefined
          ])
        )
      };
    }

    // Run it
    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Assert it
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      assert.strictEqual(root.querySelector('div.parent').childNodes.length, 2);
      assert.strictEqual(root.querySelector('h4.child3').childNodes.length, 2);
      assert.strictEqual(root.querySelector('div.grandchild32').childNodes.length, 1);
      dispose();
      done();
    });
    dispose = run();
  });

  it('should render textContent "0" given hyperscript content value number 0', function (done) {
    function app() {
      return {
        DOM: most.of(div('.my-class', 0))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const divEl = root.querySelector('.my-class');
      assert.strictEqual(divEl.textContent, '0');
      setTimeout(() => {
        dispose();
        done();
      });
    });
    dispose = run();
  });
});
