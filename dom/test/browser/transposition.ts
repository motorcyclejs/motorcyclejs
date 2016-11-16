/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { h4, h3, div, p, svg, makeDOMDriver } from '../../src/index'
import * as Fixture89 from './fixture/issue-89'
import { createRenderTarget } from '../helpers'
import * as most from 'most'

describe('DOM rendering with transposition', function () {
  it('should accept a view wrapping a VTree$ (#89)', function (done) {
    function app() {
      const number$ = Fixture89.makeModelNumber$();
      return {
        DOM: Fixture89.viewWithContainerFn(number$)
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any;
    sources.DOM.select('.myelementclass').elements().skip(1).first() // 1st
      .observe(function (elements: HTMLElement[]) {
        const myelement = elements[0];
        assert.notStrictEqual(myelement, null);
        assert.strictEqual(myelement.tagName, 'H3');
        assert.strictEqual(myelement.textContent, '123');
      });
    sources.DOM.select('.myelementclass').elements().skip(2).first() // 2nd
      .observe(function (elements: HTMLElement[]) {
        const myelement = elements[0];
        assert.notStrictEqual(myelement, null);
        assert.strictEqual(myelement.tagName, 'H3');
        assert.strictEqual(myelement.textContent, '456');
        setTimeout(() => {
          dispose();
          done();
        });
      });
    dispose = run();
  });

  it('should accept a view with VTree$ as the root of VTree', function (done) {
    function app() {
      const number$ = Fixture89.makeModelNumber$();
      return {
        DOM: Fixture89.viewWithoutContainerFn(number$)
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any;
    sources.DOM.select('.myelementclass').elements().skip(1).first() // 1st
      .observe(function (elements: HTMLElement[]) {
        const myelement = elements[0];
        assert.notStrictEqual(myelement, null);
        assert.strictEqual(myelement.tagName, 'H3');
        assert.strictEqual(myelement.textContent, '123');
      });
    sources.DOM.select('.myelementclass').elements().skip(2).first() // 1st
      .observe(function (elements: HTMLElement[]) {
        const myelement = elements[0];
        assert.notStrictEqual(myelement, null);
        assert.strictEqual(myelement.tagName, 'H3');
        assert.strictEqual(myelement.textContent, '456');
        setTimeout(() => {
          dispose();
          done();
        });
      });
    dispose = run();
  });

  it('should render a VTree with a child Observable<VTree>', function (done) {
    function app() {
      const child$ = most.of(
        h4('.child', {}, 'I am a kid')
      ).delay(80);
      return {
        DOM: most.of(div('.my-class', [
          p({}, 'Ordinary paragraph'),
          child$
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const selectEl = root.querySelector('.child');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'H4');
      assert.strictEqual(selectEl.textContent, 'I am a kid');
      setTimeout(() => {
        dispose();
        done();
      })
    });
    dispose = run()
  });

  it('should render a VTree with a grandchild Observable<VTree>', function (done) {
    function app() {
      const grandchild$ = most.of(
          h4('.grandchild', {}, [
            'I am a baby'
          ])
        ).delay(20);
      const child$ = most.of(
          h3('.child', {}, [
            'I am a kid',
            grandchild$
          ])
        ).delay(80);
      return {
        DOM: most.of(div('.my-class', [
          p({}, 'Ordinary paragraph'),
          child$
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const selectEl = root.querySelector('.grandchild');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'H4');
      assert.strictEqual(selectEl.textContent, 'I am a baby');
      setTimeout(() => {
        dispose();
        done();
      })
    });
    dispose = run()
  });

  it('should render a SVG VTree with a child Observable<VTree>', function (done) {
    function app() {
      const child$ = most.of(
        svg.g({
          attrs: {'class': 'child'}
        })
      ).delay(80);
      return {
        DOM: most.of(svg([
          svg.g(),
          child$
        ]))
      };
    }

    const {sinks, sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const selectEl = root.querySelector('.child');
      assert.notStrictEqual(selectEl, null);
      assert.notStrictEqual(typeof selectEl, 'undefined');
      assert.strictEqual(selectEl.tagName, 'g');
      setTimeout(() => {
        dispose();
        done();
      });
    });
    dispose = run();
  });

  it('should only be concerned with values from the most recent nested Observable', function (done) {
    function app() {
      return {
        DOM: most.of(
          div([
            most.of(1).concat(most.of(2).delay(5)).map(outer =>
              most.of(1).concat(most.of(2).delay(10)).map(inner =>
                div('.target', [outer + '/' + inner])
              )
            )
          ])
        )
      };
    };

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    let dispose: any;

    let expected = ['1/1', '2/1', '2/2'];

    sources.DOM.select('.target').elements()
      .skip(1)
      .map(els => els[0].innerHTML)
      .take(3)
      .observe((x: string) => {
        assert.strictEqual(x, expected.shift());
      }, err => done(err), () => {
        assert.strictEqual(expected.length, 0);
        setTimeout(() => {
          dispose();
          done();
        });
      });
    dispose = run();
  });
});
