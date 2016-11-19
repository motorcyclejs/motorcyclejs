/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { h, svg, div, span, h2, h3, h4, button, makeDOMDriver, VNode, DOMSource } from '../../src/index'
import isolate from '@cycle/isolate'
import * as most from 'most'
import { sync } from 'most-subject'
import hold from '@most/hold'
import { createRenderTarget, interval } from '../helpers'

describe('isolateSource', function () {
  it('should have the same effect as DOM.select()', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$MOTORCYCLEDOM$$-foo'}, [
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
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) => {
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
    dispose = run();
  });

  it('should return source also with isolateSource and isolateSink', function (done) {
    function app() {
      return {
        DOM: most.of(h('h3.top-most'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    let dispose = run();
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
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
      const vtree$ = most.of(h3('.top-most'));
      return {
        DOM: sources.DOM.isolateSink(vtree$, 'foo'),
      };
    }

    const {sinks, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Make assertions
    sinks.DOM.take(1).observe(function (vtree: VNode) {
      assert.strictEqual(vtree.sel, 'h3');
      assert.strictEqual((vtree.data as any).isolate, '$$MOTORCYCLEDOM$$-foo');
      setTimeout(() => {
        dispose();
        done();
      })
    });
    dispose = run()
  });

  it('should not redundantly repeat the scope className', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
      const vtree1$ = most.of(span('.tab1', 'Hi'));
      const vtree2$ = most.of(span('.tab2', 'Hello'));
      const first$ = sources.DOM.isolateSink(vtree1$, '1');
      const second$ = sources.DOM.isolateSink(vtree2$, '2');
      const switched$ = most.concat(
        most.of(1).delay(50),
        most.concat(
          most.of(2).delay(50),
          most.concat(
            most.of(1).delay(50),
            most.concat(
              most.of(2).delay(50),
              most.concat(
                most.of(1).delay(50),
                most.of(2).delay(50)
              )
            )
          )
        )
      ).map(i => i === 1 ? first$ : second$).switch();
      return {
        DOM: switched$
      };
    }

    const {sinks, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    // Make assertions
    sinks.DOM.skip(2).take(1).observe(function (vtree: VNode) {
      assert.strictEqual(vtree.sel, 'span');
      assert.strictEqual((vtree.data as any).isolate, '$$MOTORCYCLEDOM$$-1');
      dispose();
      done();
    });
    dispose = run();
  });
});

describe('isolation', function () {
  it('should prevent parent from DOM.selecting() inside the isolation', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
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

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    sources.DOM.select('.bar').elements().skip(1).take(1).observe(function (elements: HTMLElement[]) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H2');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
    run()
  });

  it('should allow parent to DOM.select() in its own isolation island', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
      const {isolateSource, isolateSink} = sources.DOM;
      const islandElement$ = isolateSource(sources.DOM, 'island')
        .select('.bar').elements();
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

    const {sinks, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    sinks.island.skip(1).take(1).observe(function (elements: HTMLElement[]) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H3');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
    run()
  });

  it('should isolate DOM.select between parent and (wrapper) child', function (done) {
    type Sources = {
      DOM: DOMSource
      content$: most.Stream<VNode>
    }
    function Frame(sources: Sources) {
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

    function Monalisa(sources: Sources) {
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

    const {sources, sinks, run} = Cycle(Monalisa, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });
    let dispose: any;

    const frameClick$ = sinks.frameClick.map((ev: Event) => ({
      type: ev.type,
      tagName: (ev.target as HTMLElement).tagName
    }));

    const monalisaClick$ = sinks.monalisaClick.map((ev: Event) => ({
      type: ev.type,
      tagName: (ev.target as HTMLElement).tagName
    }));

    // Stop the propagtion of the first click
    sinks.monalisaClick.take(1).observe((ev: Event) => ev.stopPropagation());

    // The frame should be notified about 2 clicks:
    //  1. the second click on monalisa (whose propagation has not stopped)
    //  2. the only click on the frame itself
    const expected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'H4'},
    ]
    frameClick$.take(2).observe((event: any) => {
      let e = expected.shift() as any
      if (event !== undefined && event.type !== undefined && event.tagName !== undefined) {
        assert.strictEqual((event as any).type, e.type);
        assert.strictEqual((event as any).tagName, e.tagName);
      } else {
        done(new Error());
      }
      if (expected.length === 0) {
        dispose();
        done();
      }
      return void 0
    });

    // Monalisa should receive two clicks
    const otherExpected = [
      {type: 'click', tagName: 'SPAN'},
      {type: 'click', tagName: 'SPAN'},
    ]
    monalisaClick$.take(2).observe((event: any) => {
      let e = otherExpected.shift() as any;
      if (event !== undefined && event.type !== undefined && event.tagName !== undefined) {
        assert.strictEqual((event as any).type, e.type);
        assert.strictEqual((event as any).tagName, e.tagName);
      } else {
        done(new Error());
      }
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
      const frameFoo: any = root.querySelector('.foo.frame');
      const monalisaFoo: any = root.querySelector('.foo.monalisa');
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
    dispose = run();
  });

  it('should allow a child component to DOM.select() its own root', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
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

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;
    let dispose: any;
    isolateSource(sources.DOM, 'ISOLATION')
      .select('.foo').elements()
      .skip(1).take(1)
      .observe(function (elements: HTMLElement[]) {
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
    dispose = run();
  });

  it('should allow DOM.selecting svg elements', function (done) {
    type Sources = {
      DOM: DOMSource
    }
    function App(sources: Sources) {
      const triangleElement$ = sources.DOM.select('.triangle').elements();

      const svgTriangle = svg({ props: { width: 150, height: 150 } }, [
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

    function IsolatedApp(sources: Sources) {
      const {isolateSource, isolateSink} = sources.DOM
      const isolatedDOMSource = isolateSource(sources.DOM, 'ISOLATION');
      const app = App({DOM: isolatedDOMSource});
      const isolateDOMSink = isolateSink(app.DOM, 'ISOLATION');
      return {
        DOM: isolateDOMSink,
        triangleElement: app.triangleElement
      };
    }

    const {sinks, run} = Cycle(IsolatedApp, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    // Make assertions
    sinks.triangleElement.skip(1).take(1).observe((elements: HTMLElement[]) => {
      assert.strictEqual(elements.length, 1);
      const triangleElement = elements[0];
      assert.notStrictEqual(triangleElement, null);
      assert.notStrictEqual(typeof triangleElement, 'undefined');
      assert.strictEqual(triangleElement.tagName, 'polygon');
      done();
    });
    run();
  });

  it('should allow DOM.select()ing its own root without classname or id', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
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

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('span').elements()
      .skip(1).take(1)
      .observe(function (elements: HTMLElement[]) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 1);
        const correctElement = elements[0];
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(correctElement.tagName, 'SPAN');
        done();
      });

    run();
  });

  it('should allow DOM.select()ing all elements with `*`', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function app(sources: AppSources) {
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

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true})
    });

    const {isolateSource} = sources.DOM;

    isolateSource(sources.DOM, 'ISOLATION')
      .select('*').elements()
      .skip(1).take(1)
      .observe(function (elements: HTMLElement[]) {
        assert.strictEqual(Array.isArray(elements), true);
        assert.strictEqual(elements.length, 4);
        done();
      });

    run();
  });

  it('should select() isolated element with tag + class', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$MOTORCYCLEDOM$$-foo'}, [
              h4('.bar', 'Correct')
            ])
          ])
        )
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('h4.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) =>  {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });
    run();
  });

  it('should process bubbling events from inner to outer component', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({isolate: '$$MOTORCYCLEDOM$$-foo'}, [
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
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    let called = false

    sources.DOM.select('.top-most').events('click').observe(() => {
      assert.strictEqual(called, true)
      dispose();
      done();
    })

    isolatedDOMSource.select('h4.bar').events('click').observe(() => {
      assert.strictEqual(called, false)
      called = true
    })

    // Make assertions
    isolatedDOMSource.select('h4.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) =>  {
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
    dispose = run();
  });

  it('should stop bubbling the event if the currentTarget was removed', function (done) {
    type AppSources = {
      DOM: DOMSource
    }
    function main(sources: AppSources) {
      const childExistence$ = sources.DOM.isolateSource(sources.DOM, 'foo')
        .select('h4.bar').events('click')
        .map(() => false)
        .startWith(true);

      return {
        DOM: childExistence$.map((exists: boolean) =>
          div([
            div('.top-most', {isolate: '$$MOTORCYCLEDOM$$-top'}, [
              h2('.bar', 'Wrong'),
              exists ? div({isolate: '$$MOTORCYCLEDOM$$-foo'}, [
                h4('.bar', 'Correct')
              ]) : null
            ])
          ])
        )
      };
    }

    const {sources, run} = Cycle(main, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    let dispose: any;
    const topDOMSource = sources.DOM.isolateSource(sources.DOM, 'top');
    const fooDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    let parentEventHandlerCalled = false;

    topDOMSource.select('.bar').events('click').observe(() => {
      parentEventHandlerCalled = true;
      done('this should not be called');
    });

    // Make assertions
    fooDOMSource.select('.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) =>  {
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
    dispose = run();
  });

  it('should handle a higher-order graph when events() are subscribed', done => {
    let errorHappened = false;
    let clickDetected = false;

    type AppSources = {
      DOM: DOMSource
    }

    function Child(sources: AppSources) {
      return {
        DOM: sources.DOM.select('.foo').events('click')
          .tap(() => {
            clickDetected = true;
          })
          .map(() => 1)
          .startWith(0)
          .map(() =>
            div('.container', [
              h3('.foo', 'Child foo')
            ])
          )
      };
    }

    function main(sources: AppSources) {
      const first = isolate(Child, 'first')(sources);
      first.DOM = first.DOM.thru(hold);
      first.DOM.drain();
      const second = isolate(Child, 'second')(sources);
      second.DOM = second.DOM.thru(hold);
      second.DOM.drain()
      const oneChild = [first];
      const twoChildren = [first, second];
      const vnode$ = interval(50).take(1).startWith(-1)
        .map(i => i === -1 ? oneChild : twoChildren)
        .map((children: { DOM: most.Stream<VNode> }[]) =>
          most.combineArray<any, any, any>(
            (...childVNodes: any[]) => div('.parent', childVNodes),
            children.map((child: { DOM: most.Stream<VNode> }) => child.DOM) as any,
          )
        ).switch();
      return {
        DOM: vnode$
      };
    }

    const {sources, run} = Cycle(main, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(2).take(1).observe(function ([root]: HTMLElement[]) {
      const parentEl = root.querySelector('.parent');
      const foo: any = parentEl.querySelectorAll('.foo')[1];
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
    dispose = run();
  });

  it('should handle events when child is removed and re-added', done => {
    let clicksCount = 0;
    type AppSources = {
      DOM: DOMSource
    } 
    function Child(sources: AppSources) {
      sources.DOM.select('.foo').events('click').observe(() => clicksCount++);
      return {
        DOM: most.of(div('.foo', ['This is foo']))
      };
    }

    function main(sources: AppSources) {
      const child = isolate(Child)(sources);
      // make child.DOM be inserted, removed, and inserted again
      const innerDOM$ = interval(120).take(3)
        .map(x => x === 1 ? most.of(div()) : child.DOM).switch();
      return {
        DOM: innerDOM$
      };
    }

    const {sources, run} = Cycle(main, {
      DOM: makeDOMDriver(createRenderTarget(), {transposition: true}),
    });

    let dispose: any;
    sources.DOM.select(':root').elements().skip(1).observe(function ([root]: HTMLElement[]) {
      setTimeout(() => {
        const foo: any = root.querySelector('.foo');
        if (!foo) return;
        foo.click();
      }, 0);
    });
    setTimeout(function(){
      assert.strictEqual(clicksCount, 2);
      dispose();
      done();
    }, 500);
    dispose = run();
  });

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component', (done) => {
    let dispose: any;
    type AppSources = {
      DOM: DOMSource
    }
    function Component(sources: AppSources) {
      sources.DOM.select('.btn').events('click')
        .observe((ev: Event) => {
          assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON')
          dispose()
          done()
        })
      return {
        DOM: most.of(
          div('.component', {}, [
            button('.btn', {}, 'Hello')
          ])
        )
      }
    }

    function main(sources: AppSources) {
      const component = isolate(Component)(sources)

      return {DOM: component.DOM}
    }

    function app(sources: AppSources) {
      return isolate(main)(sources)
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    })

    sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) =>  {
      const element: any = root.querySelector('.btn')
      assert.notStrictEqual(element, null)
      setTimeout(() => element.click())
    })

    dispose = run()
  })

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on child', (done) => {
      let dispose: any;
    type AppSources = {
      DOM: DOMSource
    }
    function Component(sources: AppSources) {
      sources.DOM.select('.btn').events('click')
        .observe((ev: Event) => {
          assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON')
          dispose()
          done()
        })
      return {
        DOM: most.of(
          div('.component', {}, [
            button('.btn', {}, 'Hello')
          ])
        )
      }
    }

    function main(sources: AppSources) {
      const component = isolate(Component, 'foo')(sources)
      return {DOM: component.DOM}
    }

    function app(sources: AppSources) {
      return isolate(main)(sources)
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    })

    sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) =>  {
      const element: any = root.querySelector('.btn')
      assert.notStrictEqual(element, null)
      setTimeout(() => element.click())
    })

    dispose = run()
  })

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on parent', (done) => {
      let dispose: any;
    type AppSources = {
      DOM: DOMSource
    }
    function Component(sources: AppSources) {
      sources.DOM.select('.btn').events('click')
        .observe((ev: Event) => {
          assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON')
          dispose()
          done()
        })
      return {
        DOM: most.of(
          div('.component', {}, [
            button('.btn', {}, 'Hello')
          ])
        )
      }
    }

    function main(sources: AppSources) {
      const component = isolate(Component)(sources)

      return {DOM: component.DOM}
    }

    function app(sources: AppSources) {
      return isolate(main, 'foo')(sources)
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    })

    sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) =>  {
      const element: any = root.querySelector('.btn')
      assert.notStrictEqual(element, null)
      setTimeout(() => element.click())
    })

    dispose = run()
  })

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on parent and child', (done) => {
      let dispose: any;
      type AppSources = {
        DOM: DOMSource
      }
    function Component(sources: AppSources) {
      sources.DOM.select('.btn').events('click')
        .observe((ev: Event) => {
          assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON')
          dispose()
          done()
        })
      return {
        DOM: most.of(
          div('.component', {}, [
            button('.btn', {}, 'Hello')
          ])
        )
      }
    }

    function main(sources: AppSources) {
      const component = isolate(Component, 'bar')(sources)

      return {DOM: component.DOM}
    }

    function app(sources: AppSources) {
      return isolate(main, 'foo')(sources)
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    })

    sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) =>  {
      const element: any = root.querySelector('.btn')
      assert.notStrictEqual(element, null)
      setTimeout(() => element.click())
    })

    dispose = run()
  })

  it('should maintain virtual DOM list sanity using keys, in a list of ' +
    'isolated components', (done) => {
      const componentRemove$ = sync<null | number>();

      type AppSources = {
        DOM: DOMSource
      }
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click').observe(() => {
          componentRemove$.next(null);
        });

        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello')
            ])
          )
        }
      }

      function main(sources: AppSources) {
        const remove$ = componentRemove$.scan((acc) => acc + 1, 0)
        const first = isolate(Component, 'first')(sources);
        const second = isolate(Component, 'second')(sources);
        const vdom$ = most.combine((vdom1, vdom2, r) => {
            if (r === 0) {
              return div([vdom1, vdom2]);
            } else if (r === 1) {
              return div([vdom2]);
            } else if (r === 2) {
              return div([]);
            } else {
              done('This case must not happen.');
              return void 0;
            }
          }, first.DOM, second.DOM, remove$,
        );
        return { DOM: vdom$ };
      }

      const {sources, run} = Cycle(main, {
        DOM: makeDOMDriver(createRenderTarget())
      })

      let dispose: any;
      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) =>  {
        const components = root.querySelectorAll('.btn')
        assert.strictEqual(components.length, 2);
        const firstElement: any = components[0];
        const secondElement: any = components[1];
        setTimeout(() => {
          firstElement.click();
        }, 100);
        setTimeout(() => {
          secondElement.click();
        }, 300);
        setTimeout(() => {
          assert.strictEqual(root.querySelectorAll('.component').length, 0);
          dispose();
          done();
        }, 500);
      });
      dispose = run();
    });
});
