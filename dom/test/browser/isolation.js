'use strict';
/* global describe, it, beforeEach */
let assert = require('assert');
let {run} = require('@motorcycle/core');
let CycleDOM = require('../../src');
let most = require('most');
let {h, svg, div, p, span, h2, h3, h4, hJSX, select, option, makeDOMDriver} = CycleDOM;

function createRenderTarget(id = null) {
  let element = document.createElement('div');
  element.className = 'cycletest';
  if (id) {
    element.id = id;
  }
  document.body.appendChild(element);
  return element;
}

describe('isolateSource', function () {
  it('should have the same effect as DOM.select()', function (done) {
    function app() {
      return {
        DOM: most.just(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div('.cycle-scope-foo', [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('.bar').observable.take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      dispose();
      done();
    });
  });

  it('should return source also with isolateSource and isolateSink', function (done) {
    function app() {
      return {
        DOM: most.just(h('h3.top-most'))
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'top-most');
    // Make assertions
    assert.strictEqual(typeof isolatedDOMSource.isolateSource, 'function');
    assert.strictEqual(typeof isolatedDOMSource.isolateSink, 'function');
    dispose();
    done();
  });
});

describe('isolateSink', function () {
  it('should add a className to the vtree sink', function (done) {
    function app(sources) {
      const vtree$ = most.just(h3('.top-most'));
      return {
        DOM: sources.DOM.isolateSink(vtree$, 'foo'),
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    sources.DOM.select(':root').observable.take(1)
      .observe(function (root) {
        const element = root.querySelector('.top-most');
        assert.notStrictEqual(element, null);
        assert.notStrictEqual(typeof element, 'undefined');
        assert.strictEqual(element.tagName, 'H3');
        assert.strictEqual(element.className, 'top-most cycle-scope-foo');
        dispose();
        done();
      });
  });

  it('should add a className to a vtree sink that had no className', function (done) {
    function app(sources) {
      const vtree$ = most.just(h3({}, []));
      return {
        DOM: sources.DOM.isolateSink(vtree$, 'foo'),
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    sources.DOM.select(':root').observable.take(1)
      .observe(function (root) {
        const element = root.querySelector('h3');
        assert.notStrictEqual(element, null);
        assert.notStrictEqual(typeof element, 'undefined');
        assert.strictEqual(element.tagName, 'H3');
        assert.strictEqual(element.className, 'cycle-scope-foo');
        dispose();
        done();
      });
  });

  it('should not redundantly repeat the scope className', function (done) {
    function app(sources) {
      const vtree1$ = most.just(span('.tab1', 'Hi'));
      const vtree2$ = most.just(span('.tab2', 'Hello'));
      const first$ = sources.DOM.isolateSink(vtree1$, '1');
      const second$ = sources.DOM.isolateSink(vtree2$, '2');
      const switched$ = most.just(1).delay(50)
          .concat(most.just(2).delay(50))
          .concat(most.just(1).delay(50))
          .concat(most.just(2).delay(50))
          .concat(most.just(1).delay(50))
          .concat(most.just(1).delay(50))
          .concat(most.just(2).delay(50))
          .map(i => i === 1 ? first$ : second$).join();
      return {
        DOM: switched$
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    sources.DOM.select(':root').observable.skip(4).take(1)
      .observe(function (root) {
        const element = root.querySelector('span');
        assert.notStrictEqual(element, null);
        assert.notStrictEqual(typeof element, 'undefined');
        assert.strictEqual(element.tagName, 'SPAN');
        assert.strictEqual(element.className, 'tab1 cycle-scope-1');
        dispose();
        done();
      });
  });
});

describe('isolation', function () {
  it('should prevent parent from DOM.selecting() inside the isolation', function (done) {
    function app(sources) {
      return {
        DOM: most.just(
          h3('.top-most', [
            sources.DOM.isolateSink(most.just(
              div('.foo', [
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION'),
            h2('.bar', 'Correct'),
          ])
        )
      };
    }

    const {sinks, sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.bar').observable.take(1).observe(function (elements) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H2');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
  });

  it('should allow parent to DOM.select() in its own isolation island', function (done) {
    function app(sources) {
      const {isolateSource, isolateSink} = sources.DOM;
      const islandElement$ = isolateSource(sources.DOM, 'island')
        .select('.bar').observable;
      const islandVTree$ = isolateSink(
        most.just(div([h3('.bar', 'Correct')])), 'island'
      );
      return {
        DOM: most.just(
          h3('.top-most', [
            sources.DOM.isolateSink(most.just(
              div('.foo', [
                islandVTree$,
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION'),
          ])
        ),
        island: islandElement$
      };
    }

    const {sinks, sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sinks.island.take(1).observe(function (elements) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H3');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
  });

  it('should isolate DOM.select between parent and (wrapper) child', function (done) {
    function Frame(sources) {
      const click$ = sources.DOM.select('.foo').events('click');
      const vtree$ = most.just(
        h4('.foo.frame', {style: {backgroundColor: 'lightblue'}}, [
          sources.content$
        ])
      );
      return {
        DOM: vtree$,
        click$
      };
    }

    function Monalisa(sources) {
      const {isolateSource, isolateSink} = sources.DOM;

      const islandDOMSource = isolateSource(sources.DOM, 'island');
      const click$ = islandDOMSource.select('.foo').events('click');
      const islandDOMSink$ = isolateSink(
        most.just(span('.foo.monalisa', 'Monalisa')),
        'island'
      );

      const frameDOMSource = isolateSource(sources.DOM, 'myFrame');
      const frame = Frame({ DOM: frameDOMSource, content$: islandDOMSink$ });
      const outerVTree$ = isolateSink(frame.DOM, 'myFrame');

      return {
        DOM: outerVTree$,
        frameClick: frame.click$,
        monalisaClick: click$
      };
    }

    const {sources, sinks, dispose} = run(Monalisa, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const frameClick$ = sinks.frameClick.map(ev => ({
      type: ev.type,
      tagName: ev.target.tagName
    }));

    const monalisaClick$ = sinks.monalisaClick.map(ev => ({
      type: ev.type,
      tagName: ev.target.tagName
    }));

    // Stop the propagtion of the first click
    sinks.monalisaClick.take(1).observe(ev => ev.stopPropagation());

    const actual = [];
    const expected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'H4'},
    ];
    // The frame should be notified about 2 clicks:
    //  1. the second click on monalisa (whose propagation has not stopped)
    //  2. the only click on the frame itself
    frameClick$.take(2).observe(value => {
      actual.push(value)
    }).then(() => {
      assert.deepEqual(actual, expected)
      dispose();
      done();
    }).catch(done.fail);

    const monalisaActual = [];
    const monalisaExpected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'SPAN'},
    ];

    // Monalisa should receive two clicks
    monalisaClick$.take(2).observe(value => {
      monalisaActual.push(value);
    }).then(() => {
      assert.deepEqual(monalisaActual, monalisaExpected);
    }).catch(done.fail);

    sources.DOM.select(':root').observable.take(1).observe(root => {
      const frameFoo = root.querySelector('.foo.frame');
      const monalisaFoo = root.querySelector('.foo.monalisa');
      assert.notStrictEqual(frameFoo, null);
      assert.notStrictEqual(monalisaFoo, null);
      assert.notStrictEqual(typeof frameFoo, 'undefined');
      assert.notStrictEqual(typeof monalisaFoo, 'undefined');
      assert.strictEqual(frameFoo.tagName, 'H4');
      assert.strictEqual(monalisaFoo.tagName, 'SPAN');
      assert.doesNotThrow(() => {
        monalisaFoo.click();
        monalisaFoo.click();
        setTimeout(() => frameFoo.click(), 0);
      });
    });
  });

  it('should allow a child component to DOM.select() its own root', function (done) {
    function app(sources) {
      return {
        DOM: most.just(
          h3('.top-most', [
            sources.DOM.isolateSink(most.just(
              span('.foo', [
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION')
          ])
        )
      };
    }

    const {sinks, sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('.foo').observable
      .take(1)
      .observe(function (elements) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        const correctElement = elements[0];
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(correctElement.tagName, 'SPAN');
        done();
      });
  });

  it('should allow DOM.selecting svg elements', function (done) {
   function App(sources) {
     const triangleElement$ = sources.DOM.select('.triangle').observable;

     const svgTriangle = h('svg', {attrs: {width: 150, height: 150}}, [
       h('polygon', {
         attrs: {
           class: 'triangle',
           points: '20 0 20 150 150 20'
         }
       }),
     ]);

     return {
       DOM: most.just(svgTriangle),
       triangleElement: triangleElement$
     };
   }

   function IsolatedApp(sources) {
     const {isolateSource, isolateSink} = sources.DOM
     const isolatedDOMSource = isolateSource(sources.DOM, 'ISOLATION');
     const app = App({DOM: isolatedDOMSource});
     const isolateDOMSink = isolateSink(app.DOM, 'ISOLATION');
     return {
       DOM: isolateDOMSink,
       triangleElement: app.triangleElement
     };
   }

   const {sinks, sources} = run(IsolatedApp, {
     DOM: makeDOMDriver(createRenderTarget())
   });

   // Make assertions
   const selection = sinks.triangleElement.observe(elements => {
     assert.strictEqual(elements.length, 1);
     const triangleElement = elements[0];
     assert.notStrictEqual(triangleElement, null);
     assert.notStrictEqual(typeof triangleElement, 'undefined');
     assert.strictEqual(triangleElement.tagName, 'polygon');
     done();
   });
 });

  it('should allow DOM.select()ing its own root without classname or id', function(done) {
    function app(sources) {
      return {
        DOM: most.just(
          h3('.top-most', [
            sources.DOM.isolateSink(most.just(
              span([
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION')
          ])
        )
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('span').observable
      .take(1)
      .observe(function (elements) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        const correctElement = elements[0];
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(correctElement.tagName, 'SPAN');
        dispose();
        done();
      });
  });

  it('should allow DOM.select()ing all elements with `*`', function(done) {
    function app(sources) {
      return {
        DOM: most.just(
          h3('.top-most', [
            sources.DOM.isolateSink(most.just(
              span([
                div([
                  h4('.foo', 'hello'),
                  h4('.bar', 'world')
                ])
              ])
            ), 'ISOLATION')
          ])
        )
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
    .select('*').observable
    .take(1)
    .observe(function (elements) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 4);
      dispose();
      done();
    });
  });

  it('should select() isolated element with tag + class', function (done) {
    function app() {
      return {
        DOM: most.just(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div('.cycle-scope-foo', [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('h4.bar').observable.take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      dispose();
      done();
    });
  });
});
