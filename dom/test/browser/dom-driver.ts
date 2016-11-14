/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { div, h3, makeDOMDriver } from '../../src/index'
import * as most from 'most'
import { createRenderTarget } from '../helpers'

describe('makeDOMDriver', function () {
  it('should accept a DOM element as input', function () {
    const element = createRenderTarget();
    assert.doesNotThrow(function () {
      makeDOMDriver(element);
    });
  });

  it('should accept a string selector to an existing element as input', function () {
    const id = 'testShouldAcceptSelectorToExisting';
    const element = createRenderTarget();
    element.id = id;
    assert.doesNotThrow(function () {
      makeDOMDriver('#' + id);
    });
  });

  it('should not accept a selector to an unknown element as input', function () {
    assert.throws(function () {
      makeDOMDriver('#nonsenseIdToNothing');
    }, /Cannot render into unknown element/);
  });

  it('should not accept a number as input', function () {
    const x: any = 123
    assert.throws(function () {
      makeDOMDriver(x as HTMLElement);
    }, /Given container is not a DOM element neither a selector string/);
  });

});

describe('DOM Driver', function () {
  it('should have isolateSource() and isolateSink() in source', function (done) {
    function app() {
      return {
        DOM: most.of(div())
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    let dispose = run();
    assert.strictEqual(typeof sources.DOM.isolateSource, 'function');
    assert.strictEqual(typeof sources.DOM.isolateSink, 'function');
    dispose();
    done();
  });

  it('should not work after has been disposed', function (done) {
    const number$ = most.from([1, 2, 3])
      .concatMap(x => most.of(x).delay(50));

    function app() {
      return {
        DOM: number$.map(number =>
            h3('.target', String(number))
        )
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: Function;
    sources.DOM.select(':root').elements().skip(1).observe(function (root: HTMLElement) {
      const selectEl = root.querySelector('.target');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'H3');
      assert.notStrictEqual(selectEl.textContent, '3');
      if (selectEl.textContent === '2') {
        dispose();
        setTimeout(() => {
          done();
        }, 100);
      }
    });
    dispose = run();
  });
});
