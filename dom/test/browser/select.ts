/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { div, p, span, h3, h2, h4, svg, makeDOMDriver } from '../../src/index'
import * as most from 'most'
import { createRenderTarget } from '../helpers'

describe('DOMSource.select()', function () {
  it('should have Observable `:root` in DOM source', function (done) {
    function app() {
      return {
        DOM: most.of(
          div('.top-most', [
            p('Foo'),
            span('Bar')
          ])
        )
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      assert.strictEqual(root.tagName, 'DIV');
      const child = root.children[0];
      assert(child.className.indexOf('top-most') > -1)
      setTimeout(() => {
        dispose();
        done();
      })
    });

    dispose = run()
  });

  it('should return a DOMSource with elements(), events(), select()', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any = run();
    // Make assertions
    const selection = sources.DOM.select('.myelementclass');
    assert.strictEqual(typeof selection, 'object');
    assert.strictEqual(typeof selection.select, 'function');
    assert.strictEqual(typeof selection.select('h3'), 'object');
    assert.strictEqual(typeof selection.elements, 'function');
    assert.strictEqual(typeof selection.elements(), 'object');
    assert.strictEqual(typeof selection.elements().subscribe, 'function');
    assert.strictEqual(typeof selection.events, 'function');
    assert.strictEqual(typeof selection.events('click'), 'object');
    assert.strictEqual(typeof selection.events('click').subscribe, 'function');
    dispose();
    done();
  });

  it('should have an observable of DOM elements', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Make assertions
    sources.DOM.select('.myelementclass').elements().skip(1).take(1)
      .observe((elements: HTMLElement[]) => {
        assert.notStrictEqual(elements, null);
        assert.notStrictEqual(typeof elements, 'undefined');
        // Is an Array
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        // Array with the H3 element
        assert.strictEqual(elements[0].tagName, 'H3');
        assert.strictEqual(elements[0].textContent, 'Foobar');
        setTimeout(() => {
          dispose();
          done();
        });
      });
    dispose = run();
  });

  it('should not select element outside the given scope', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div('.foo', [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Make assertions
    sources.DOM.select('.foo').select('.bar').elements().skip(1).take(1)
      .observe((elements: HTMLElement[]) => {
        assert.strictEqual(elements.length, 1);
        const element = elements[0];
        assert.notStrictEqual(element, null);
        assert.notStrictEqual(typeof element, 'undefined');
        assert.strictEqual(element.tagName, 'H4');
        assert.strictEqual(element.textContent, 'Correct');
        setTimeout(() => {
          dispose();
          done();
        });
      })
    dispose = run();
  });

  it('should select svg element', function (done) {
    function app() {
      return {
        DOM: most.of(
          svg({ props: { width: 150, height: 150 } }, [
            svg.polygon({
              attrs: {
                class: 'triangle',
                points: '20 0 20 150 150 20'
              }
            }),
          ])
        )
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    sources.DOM.select('.triangle').elements().skip(1).take(1)
      .observe((elements: HTMLElement[]) => {
        assert.strictEqual(elements.length, 1);
        const triangleElement = elements[0];
        assert.notStrictEqual(triangleElement, null);
        assert.notStrictEqual(typeof triangleElement, 'undefined');
        assert.strictEqual(triangleElement.tagName, 'polygon');
        done();
      });
    run();
  });
});
