/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { div, h, HTMLSource, makeHTMLDriver } from '../../src/index'
import * as most from 'most'
import { interval } from '../helpers'

describe('HTML Driver', () => {
  it('should output HTML when given a simple vtree stream', (done) => {
    function app() {
      return {
        html: most.of(div('.test-element', 'Foobar'))
      }
    }

    function effect(html: string) {
      assert(html === '<div class="test-element">Foobar</div>')
      done()
    }

    Cycle.run(app, {
      html: makeHTMLDriver(effect)
    })
  })

  it('should allow effect to see one or more HTML outputs', done => {
    function app() {
      return {
        html: interval(150).take(3).map(i =>
          div('.test-element', 'Foobar' + i)
        )
      };
    }

    const expected = [
      '<div class="test-element">Foobar0</div>',
      '<div class="test-element">Foobar1</div>',
      '<div class="test-element">Foobar2</div>',
    ]

    function effect(html: string) {
      assert.strictEqual(html, expected.shift());
      if (expected.length === 0) {
        done();
      }
    }

    let {run} = Cycle(app, {
      html: makeHTMLDriver(effect),
    });
    run()
  })

  it('should allow effect to see one (the last) HTML outputs', function (done) {
    function app() {
      return {
        html: interval(150).take(3).map(i =>
          div('.test-element', 'Foobar' + i)
        ).skip(2)
      };
    }

    function effect(html: string) {
      assert.strictEqual(html, '<div class="test-element">Foobar2</div>');
      done();
    }

    let {run} = Cycle(app, {
      html: makeHTMLDriver(effect),
    });
    run()
  })

  it('should make bogus select().events() as sources', function (done) {
    type appSources = {
      html: HTMLSource
    }
    function app({html}: appSources) {
      assert.strictEqual(typeof html.select, 'function');
      assert.strictEqual(typeof html.select('whatever').elements().subscribe, 'function');
      assert.strictEqual(typeof html.select('whatever').events('click').subscribe, 'function');
      return {
        html: most.of(div('.test-element', ['Foobar']))
      };
    }

    function effect(html: string) {
      assert.strictEqual(html, '<div class="test-element">Foobar</div>');
      done();
    }

    let {run} = Cycle(app, {
      html: makeHTMLDriver(effect),
    });
    run();
  });

  it('should output simple HTML Observable', function (done) {
    function app() {
      return {
        html: most.of(div('.test-element', ['Foobar']))
      };
    }

    function effect(html: string) {
      assert.strictEqual(html, '<div class="test-element">Foobar</div>');
      done();
    }

    let {run} = Cycle(app, {
      html: makeHTMLDriver(effect),
    });
    run();
  });

  describe('with transposition=true', function () {
    it('should render a simple nested vtree$ as HTML', function (done) {
      function app() {
        return {
          DOM: most.of(h('div.test-element', [
            most.of(h('h3.myelementclass'))
          ]))
        };
      }

      function effect(html: string) {
        assert.strictEqual(html,
          '<div class="test-element">' +
            '<h3 class="myelementclass"></h3>' +
          '</div>'
        );
        done();
      }

      let {run} = Cycle(app, {
        DOM: makeHTMLDriver(effect, {transposition: true})
      });
      run()
    });

    it('should render double nested vtree$ as HTML', function (done) {
      function app() {
        return {
          html: most.of(h('div.test-element', [
            most.of(h('div.a-nice-element', [
              String('foobar'),
              most.of(h('h3.myelementclass'))
            ]))
          ]))
        };
      }

      function effect(html: string) {
        assert.strictEqual(html,
          '<div class="test-element">' +
            '<div class="a-nice-element">' +
              'foobar<h3 class="myelementclass"></h3>' +
            '</div>' +
          '</div>'
        );
        done();
      }

      let {run} = Cycle(app, {
        html: makeHTMLDriver(effect, {transposition: true})
      })

      run()
    });

    it('should HTML-render a nested vtree$ with props', function (done) {
      function myElement(foobar$: most.Stream<string>) {
        return foobar$.map((foobar: string) =>
          h('h3.myelementclass', String(foobar).toUpperCase())
        );
      }
      function app() {
        return {
          DOM: most.of(
            h('div.test-element', [
              myElement(most.of('yes'))
            ])
          )
        };
      }

      function effect(html: string) {
        assert.strictEqual(html,
          '<div class="test-element">' +
            '<h3 class="myelementclass">YES</h3>' +
          '</div>'
        );
        done();
      }

      let {run} = Cycle(app, {
        DOM: makeHTMLDriver(effect, {transposition: true})
      });

      run()
    });

    it('should render a complex and nested vtree$ as HTML', function (done) {
      function app() {
        return {
          html: most.of(
            h('.test-element', [
              h('div', [
                h('h2.a', 'a'),
                h('h4.b', 'b'),
                most.of(h('h1.fooclass'))
              ]),
              h('div', [
                h('h3.c', 'c'),
                h('div', [
                  h('p.d', 'd'),
                  most.of(h('h2.barclass'))
                ])
              ])
            ])
          )
        };
      }

      function effect(html: string) {
        assert.strictEqual(html,
          '<div class="test-element">' +
            '<div>' +
              '<h2 class="a">a</h2>' +
              '<h4 class="b">b</h4>' +
              '<h1 class="fooclass"></h1>' +
            '</div>' +
            '<div>' +
              '<h3 class="c">c</h3>' +
              '<div>' +
                '<p class="d">d</p>' +
                '<h2 class="barclass"></h2>' +
              '</div>' +
            '</div>' +
          '</div>'
        );
        done();
      }

      let {run} = Cycle(app, {
        html: makeHTMLDriver(effect, {transposition: true})
      });

      run();
    });
  });
})
