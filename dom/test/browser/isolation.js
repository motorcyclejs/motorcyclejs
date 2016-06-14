'use strict';
/* global describe, it, beforeEach */
let assert = require('assert');
let Cycle = require('@motorcycle/core').default;
let CycleDOM = require('../../src/index');
let isolate = require('@cycle/isolate').default;
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
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$CYCLEDOM$$-foo'}, [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    debugger
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('.bar').elements.skip(1).take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      setTimeout(() => {
        dispose();
        done();
      })
    });
    ;
  });

  it('should return source also with isolateSource and isolateSink', function (done) {
    function app() {
      return {
        DOM: most.of(h('h3.top-most'))
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
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
  it('should add an isolate field to the vtree sink', function (done) {
    function app(sources) {
      const vtree$ = most.of(h3('.top-most'));
      return {
        DOM: sources.DOM.isolateSink(vtree$, 'foo'),
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });


    // Make assertions
    sinks.DOM.take(1).observe(function (vtree) {
      assert.strictEqual(vtree.sel, 'h3.top-most');
      assert.strictEqual(vtree.data.isolate, '$$CYCLEDOM$$-foo');
      setTimeout(() => {
        dispose();
        done();
      })
    });

  });


  it('should not redundantly repeat the scope className', function (done) {
    function app(sources) {
      const vtree1$ = most.of(span('.tab1', 'Hi'));
      const vtree2$ = most.of(span('.tab2', 'Hello'));
      const first$ = sources.DOM.isolateSink(vtree1$, '1');
      const second$ = sources.DOM.isolateSink(vtree2$, '2');
      const switched$ = most.merge(
        most.of(1).delay(50),
        most.of(2).delay(60),
        most.of(1).delay(70),
        most.of(2).delay(80),
        most.of(1).delay(90),
        most.of(2).delay(100)
      ).map(i => i === 1 ? first$ : second$).switch();
      return {
        DOM: switched$
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });


    // Make assertions
    sinks.DOM.skip(2).take(1).observe(function (vtree) {
      assert.strictEqual(vtree.sel, 'span.tab1');
      assert.strictEqual(vtree.data.isolate, '$$CYCLEDOM$$-1');
      dispose();
      done();
    });
  });
});

describe('isolation', function () {
  it('should prevent parent from DOM.selecting() inside the isolation', function (done) {
    function app(sources) {
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
              div('.foo', [
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION'),
            h2('.bar', 'Correct'),
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    sources.DOM.select('.bar').elements.skip(1).take(1).observe(function (elements) {
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
        .select('.bar').elements;
      const islandVTree$ = isolateSink(
        most.of(div([h3('.bar', 'Correct')])), 'island'
      );
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
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

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    sinks.island.skip(1).take(1).observe(function (elements) {
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
      const vtree$ = most.of(
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
        most.of(span('.foo.monalisa', 'Monalisa')),
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

    const {sources, sinks, dispose} = Cycle.run(Monalisa, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
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
    sinks.monalisaClick.skip(1).take(1).observe(ev => ev.stopPropagation());

    // The frame should be notified about 2 clicks:
    //  1. the second click on monalisa (whose propagation has not stopped)
    //  2. the only click on the frame itself
    const expected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'H4'},
    ]
    frameClick$.take(2).observe(event => {
      let e = expected.shift()
      assert.strictEqual(event.type, e.type)
      assert.strictEqual(event.tagName, e.tagName);
      if (expected.length === 0) {
        dispose();
        done();
      }
    });

    // Monalisa should receive two clicks
    const otherExpected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'SPAN'},
    ]
    monalisaClick$.take(2).observe(event => {
      let e = otherExpected.shift();
      assert.strictEqual(event.type, e.type);
      assert.strictEqual(event.tagName, e.tagName);
    });

    sources.DOM.select(':root').elements.skip(1).take(1).observe(root => {
      const frameFoo = root.querySelector('.foo.frame');
      const monalisaFoo = root.querySelector('.foo.monalisa');
      assert.notStrictEqual(frameFoo, null);
      assert.notStrictEqual(monalisaFoo, null);
      assert.notStrictEqual(typeof frameFoo, 'undefined');
      assert.notStrictEqual(typeof monalisaFoo, 'undefined');
      assert.strictEqual(frameFoo.tagName, 'H4');
      assert.strictEqual(monalisaFoo.tagName, 'SPAN');
      assert.doesNotThrow(() => {
        setTimeout(() => monalisaFoo.click());
        setTimeout(() => monalisaFoo.click());
        setTimeout(() => frameFoo.click(), 0);
      });
    });
    ;
  });

  it('should allow a child component to DOM.select() its own root', function (done) {
    function app(sources) {
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
              span('.foo', [
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION')
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('.foo').elements
      .skip(1).take(1)
      .observe(function (elements) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        const correctElement = elements[0];
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(correctElement.tagName, 'SPAN');
        setTimeout(() => {
          dispose();
          done();
        })
      });
    ;
  });

  it('should allow DOM.selecting svg elements', function (done) {
    function App(sources) {
      const triangleElement$ = sources.DOM.select('.triangle').elements;

      const svgTriangle = svg({width: 150, height: 150}, [
        svg.polygon({
          attrs: {
            class: 'triangle',
            points: '20 0 20 150 150 20'
          }
        }),
      ]);

      return {
        DOM: most.of(svgTriangle),
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

    const {sinks, sources, dispose} = Cycle.run(IsolatedApp, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    const selection = sinks.triangleElement.skip(1).take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const triangleElement = elements[0];
      assert.notStrictEqual(triangleElement, null);
      assert.notStrictEqual(typeof triangleElement, 'undefined');
      assert.strictEqual(triangleElement.tagName, 'polygon');
      done();
    });
    ;
  });

  it('should allow DOM.select()ing its own root without classname or id', function(done) {
    function app(sources) {
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
              span([
                h4('.bar', 'Wrong')
              ])
            ), 'ISOLATION')
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('span').elements
      .skip(1).take(1)
      .observe(function (elements) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        const correctElement = elements[0];
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(correctElement.tagName, 'SPAN');
        done();
      });

    ;
  });

  it('should allow DOM.select()ing all elements with `*`', function(done) {
    function app(sources) {
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
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

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('*').elements
      .skip(1).take(1)
      .observe(function (elements) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 4);
        done();
      });

    ;
  });

  it('should select() isolated element with tag + class', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$CYCLEDOM$$-foo'}, [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('h4.bar').elements.skip(1).take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
    ;
  });

  it('should process bubbling events from inner to outer component', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$CYCLEDOM$$-foo'}, [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    let called = false

    sources.DOM.select('.top-most').events('click').observe(ev => {
      assert.strictEqual(called, true)
      dispose();
      done();
    })

    isolatedDOMSource.select('h4.bar').events('click').observe(ev => {
      assert.strictEqual(called, false)
      called = true
    })

    // Make assertions
    isolatedDOMSource.select('h4.bar').elements.skip(1).take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      setTimeout(() => {
        correctElement.click();
      });
    });
    ;
  });

  it('should stop bubbling the event if the currentTarget was removed', function (done) {
    function main(sources) {
      const childExistence$ = sources.DOM.isolateSource(sources.DOM, 'foo')
        .select('h4.bar').events('click')
        .map(() => false)
        .startWith(true);

      return {
        DOM: childExistence$.map(exists =>
          div([
            div('.top-most', {isolate: '$$CYCLEDOM$$-top'}, [
              h2('.bar', 'Wrong'),
              exists ? div({isolate: '$$CYCLEDOM$$-foo'}, [
                h4('.bar', 'Correct')
              ]) : null
            ])
          ])
        )
      };
    }

    const {sinks, sources, dispose} = Cycle.run(main, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    const topDOMSource = sources.DOM.isolateSource(sources.DOM, 'top');
    const fooDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    let parentEventHandlerCalled = false;

    topDOMSource.select('.bar').events('click').observe(ev => {
      parentEventHandlerCalled = true;
      done('this should not be called');
    })

    // Make assertions
    fooDOMSource.select('.bar').elements.skip(1).take(1).observe(elements => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      setTimeout(() => {
        correctElement.click();
        setTimeout(() => {
          assert.strictEqual(parentEventHandlerCalled, false);
          dispose();
          done();
        }, 150);
      });
    });
    ;
  });

  it('should handle a higher-order graph when events() are observed', done => {
    let errorHappened = false;
    let clickDetected = false;

    function Child(sources) {
      return {
        DOM: sources.DOM.select('.foo').events('click')
          .tap(() => {
            clickDetected = true;
          })
          .recoverWith((e) => {
            errorHappened = true;
            most.throwError(e)
          })
          .map(() => 1)
          .startWith(0)
          .map(num =>
            div('.container', [
              h3('.foo', 'Child foo')
            ])
          )
      };
    }

    function main(sources) {
      const first = isolate(Child, 'first')(sources);
      first.DOM = first.DOM.multicast()
      const second = isolate(Child, 'second')(sources);
      second.DOM = second.DOM.multicast()
      const oneChild = [first];
      const twoChildren = [first, second];
      const vnode$ = most.periodic(50, 1).skip(1).take(1).startWith(-1)
        .map(i => i === -1 ? oneChild : twoChildren)
        .map(children =>
          most.combine(
            (...childVNodes) => div('.parent', childVNodes),
            ...children.map(child => child.DOM)
          )
        ).switch();
      return {
        DOM: vnode$
      };
    }

    const {sinks, sources, dispose} = Cycle.run(main, {
      DOM: makeDOMDriver(createRenderTarget())
    });


    sources.DOM.select(':root').elements.skip(2).take(1).observe(function (root) {
      const parentEl = root.querySelector('.parent');
      const foo = parentEl.querySelectorAll('.foo')[1];
      assert.notStrictEqual(parentEl, null);
      assert.notStrictEqual(typeof parentEl, 'undefined');
      assert.notStrictEqual(foo, null);
      assert.notStrictEqual(typeof foo, 'undefined');
      assert.strictEqual(parentEl.tagName, 'DIV');
      setTimeout(() => {
        assert.strictEqual(errorHappened, false);
        foo.click();
        setTimeout(() => {
          assert.strictEqual(clickDetected, true);
          dispose();
          done();
        }, 50);
      }, 100);
    });
    ;
  });

  it('should handle events when child is removed and re-added', done => {
    let clicksCount = 0;

    function Child(sources) {
      sources.DOM.select('.foo').events('click')
        .observe(() => clicksCount++)
      return {
        DOM: most.of(div('.foo', ['This is foo']))
      };
    }

    function main(sources) {
      const child = isolate(Child)(sources);
      // make child.DOM be inserted, removed, and inserted again
      const innerDOM$ = most.periodic(50, 1).scan((x, y) => x + y, 0).take(4)
        .map(x => x === 1 ? most.of(div()) : child.DOM).switch()
      return {
        DOM: innerDOM$
      };
    }

    const {sinks, sources, dispose} = Cycle.run(main, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });


    sources.DOM.select(':root').elements.observe(function (root) {
      const foo = root.querySelector('.foo');
      if (!foo) return
      foo.click();
    });
    setTimeout(function(){
      assert.strictEqual(clicksCount, 2)
      dispose()
      done()
    }, 300)
    ;
  })
});
