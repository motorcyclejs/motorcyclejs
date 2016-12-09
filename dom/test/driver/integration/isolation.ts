import * as assert from 'assert';
import * as Motorcycle from '@motorcycle/core';
import { h, svg, div, span, h2, h3, h4, button, makeDomDriver, VNode, DomSource } from '../../../src';
import isolate from '@cycle/isolate';
import * as most from 'most';
import { sync, hold } from 'most-subject';
import { createRenderTarget, interval } from '../../helpers';

describe('isolateSource', function () {
  it('should have the same effect as DOM.select()', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({ isolate: '$$MOTORCYCLEDOM$$-foo' }, [
              h4('.bar', 'Correct'),
            ]),
          ]),
        ),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

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
      });
    }).catch(done);

  });

  it('should return source also with isolateSource and isolateSink', function (done) {
    function app() {
      return {
        DOM: most.of(h('h3.top-most')),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
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
    type AppSources = {
      DOM: DomSource,
    };
    function app(sources: AppSources) {
      const vtree$ = most.of(h3('.top-most'));
      return {
        DOM: sources.DOM.isolateSink(vtree$, 'foo'),
      };
    }

    const { sinks, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    // Make assertions
    sinks.DOM.take(1).observe(function (vtree: VNode) {
      assert.strictEqual(vtree.tagName, 'h3');
      assert.strictEqual((vtree.data as any).isolate, '$$MOTORCYCLEDOM$$-foo');
      setTimeout(() => {
        dispose();
        done();
      });
    });

  });

  it('should not redundantly repeat the scope className', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
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
                most.of(2).delay(50),
              ),
            ),
          ),
        ),
      ).map(i => i === 1 ? first$ : second$).switch();
      return {
        DOM: switched$,
      };
    }

    const { sinks, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    // Make assertions
    sinks.DOM.skip(2).take(1).observe(function (vtree: VNode) {
      assert.strictEqual(vtree.tagName, 'span');
      assert.strictEqual((vtree.data as any).isolate, '$$MOTORCYCLEDOM$$-1');
      dispose();
      done();
    });

  });
});

describe('isolation', function () {
  it('should prevent parent from DOM.selecting() inside the isolation', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
    function app(sources: AppSources) {
      const isolatedView =
        sources.DOM.isolateSink(most.of(
          div('.foo', [
            h4('.bar', 'Wrong'),
          ]),
        ), 'ISOLATION');

      const DOM = isolatedView.map(view => {
        return h3('.top-most', [
          view,
          h2('.bar', 'Correct'),
        ]);
      });

      return {
        DOM,
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    sources.DOM.select('.bar').elements().skip(1).take(1).observe(function (elements: HTMLElement[]) {
      assert.strictEqual(Array.isArray(elements), true);
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H2');
      assert.strictEqual(correctElement.textContent, 'Correct');
      dispose();
      done();
    });
  });

  it('should allow parent to DOM.select() in its own isolation island', function (done) {
    type AppSources = {
      DOM: DomSource,
    };

    function app(sources: AppSources) {
      const {isolateSource, isolateSink} = sources.DOM;
      const islandElement$ = isolateSource(sources.DOM, 'island')
        .select('.bar').elements();

      const islandVTree$ = isolateSink(
        most.of(div([h3('.bar', 'Correct')])), 'island',
      );

      const view$ = islandVTree$.map(view =>
        sources.DOM.isolateSink(most.of(
          div('.foo', [
            view,
            h4('.bar', 'Wrong'),
          ]),
        ), 'ISOLATION'),
      ).switch();

      return {
        DOM: view$.map(view =>
          h3('.top-most', [
            view,
          ]),
        ),
        island: islandElement$,
      };
    }

    const { sinks } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
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

  });

  it('should allow a child component to DOM.select() its own root', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
    function app(sources: AppSources) {
      return {
        DOM: sources.DOM.isolateSink(most.of(
          span('.foo', [
            h4('.bar', 'Wrong'),
          ]),
        ), 'ISOLATION').map(view =>
          h3('.top-most', [
            view,
          ]),
        ),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    const {isolateSource} = sources.DOM;

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
        });
      });

  });

  it('should allow DOM.selecting svg elements', function (done) {
    type Sources = {
      DOM: DomSource,
    };
    function App(sources: Sources) {
      const triangleElement$ = sources.DOM.select('.triangle').elements();

      const svgTriangle = svg({ attrs: { width: 150, height: 150 } }, [
        svg.polygon({
          attrs: {
            class: 'triangle',
            points: '20 0 20 150 150 20',
          },
        }),
      ]);

      return {
        DOM: most.of(svgTriangle),
        triangleElement: triangleElement$,
      };
    }

    function IsolatedApp(sources: Sources) {
      const { isolateSource, isolateSink } = sources.DOM;
      const isolatedDOMSource = isolateSource(sources.DOM, 'ISOLATION');
      const app = App({ DOM: isolatedDOMSource });
      const isolateDOMSink = isolateSink(app.DOM, 'ISOLATION');
      return {
        DOM: isolateDOMSink,
        triangleElement: app.triangleElement,
      };
    }

    const { sinks } = Motorcycle.run<any, any>(IsolatedApp, {
      DOM: makeDomDriver(createRenderTarget()),
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

  });

  it('should allow DOM.select()ing its own root without classname or id', function (done) {
    type AppSources = {
      DOM: DomSource,
    };

    function app(sources: AppSources) {

      const view$ =
        sources.DOM.isolateSink(most.of(
          span([
            h4('.bar', 'Wrong'),
          ]),
        ), 'ISOLATION');

      return {
        DOM: view$.map(view =>
          h3('.top-most', [
            view,
          ]),
        ),
      };
    }

    const { sources } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
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


  });

  it('should allow DOM.select()ing all elements with `*`', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
    function app(sources: AppSources) {
      const view$ =
        sources.DOM.isolateSink(most.of(
          span([
            div([
              h4('.foo', 'hello'),
              h4('.bar', 'world'),
            ]),
          ]),
        ), 'ISOLATION');

      return {
        DOM: view$.map(view =>
          h3('.top-most', [
            view,
          ]),
        ),
      };
    }

    const { sources } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
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


  });

  it('should select() isolated element with tag + class', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div({ isolate: '$$MOTORCYCLEDOM$$-foo' }, [
              h4('.bar', 'Correct'),
            ]),
          ]),
        ),
      };
    }

    const { sources } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });
    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('h4.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) => {
      assert.strictEqual(elements.length, 1);
      const correctElement = elements[0];
      assert.notStrictEqual(correctElement, null);
      assert.notStrictEqual(typeof correctElement, 'undefined');
      assert.strictEqual(correctElement.tagName, 'H4');
      assert.strictEqual(correctElement.textContent, 'Correct');
      done();
    });

  });

  it('should stop bubbling the event if the currentTarget was removed', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
    function main(sources: AppSources) {
      const childExistence$ = sources.DOM.isolateSource(sources.DOM, 'foo')
        .select('h4.bar').events('click')
        .map(() => false)
        .startWith(true);

      return {
        DOM: childExistence$.map((exists: boolean) =>
          div([
            div('.top-most', { isolate: '$$MOTORCYCLEDOM$$-top' }, [
              h2('.bar', 'Wrong'),
              exists ? div({ isolate: '$$MOTORCYCLEDOM$$-foo' }, [
                h4('.bar', 'Correct'),
              ]) : null,
            ]),
          ]),
        ),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(main, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    const topDOMSource = sources.DOM.isolateSource(sources.DOM, 'top');
    const fooDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    let parentEventHandlerCalled = false;

    topDOMSource.select('.bar').events('click').observe(() => {
      parentEventHandlerCalled = true;
      done('this should not be called');
    });

    // Make assertions
    fooDOMSource.select('.bar').elements().skip(1).take(1).observe((elements: HTMLElement[]) => {
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

  });

  it('should handle a higher-order graph when events() are subscribed', done => {
    let errorHappened = false;
    let clickDetected = false;

    type AppSources = {
      DOM: DomSource,
    };

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
              h3('.foo', 'Child foo'),
            ]),
        ),
      };
    }

    function main(sources: AppSources) {
      const first = isolate(Child, 'first')(sources);
      first.DOM = first.DOM.thru(hold(1));
      first.DOM.drain();
      const second = isolate(Child, 'second')(sources);
      second.DOM = second.DOM.thru(hold(1));
      second.DOM.drain();
      const oneChild = [first];
      const twoChildren = [first, second];
      const vnode$ = interval(50).take(1).startWith(-1)
        .map(i => i === -1 ? oneChild : twoChildren)
        .map((children: { DOM: most.Stream<VNode> }[]) =>
          most.combineArray<any, any, any>(
            (...childVNodes: any[]) => div('.parent', childVNodes),
            children.map((child: { DOM: most.Stream<VNode> }) => child.DOM) as any,
          ),
      ).switch();
      return {
        DOM: vnode$,
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(main, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    sources.DOM.select(':root').elements().skip(2).take(1).observe(function ([root]: HTMLElement[]) {
      const parentEl = root.querySelector('.parent') as HTMLElement;
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

  });

  it('should handle events when child is removed and re-added', done => {
    let clicksCount = 0;
    type AppSources = {
      DOM: DomSource,
    };
    function Child(sources: AppSources) {
      sources.DOM.select('.foo').events('click').observe(() => clicksCount++);
      return {
        DOM: most.of(div('.foo', ['This is foo'])),
      };
    }

    function main(sources: AppSources) {
      const child = isolate(Child)(sources);
      // make child.DOM be inserted, removed, and inserted again
      const innerDOM$ = interval(120).take(3)
        .map(x => x === 1 ? most.of(div()) : child.DOM).switch();
      return {
        DOM: innerDOM$,
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(main, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    sources.DOM.select(':root').elements().skip(1).observe(function ([root]: HTMLElement[]) {
      setTimeout(() => {
        const foo: any = root.querySelector('.foo');
        if (!foo) return;
        foo.click();
      }, 0);
    });
    setTimeout(function () {
      assert.strictEqual(clicksCount, 2);
      dispose();
      done();
    }, 500);

  });

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component', (done) => {

      type AppSources = {
        DOM: DomSource,
      };
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click')
          .observe((ev: Event) => {
            assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON');
            dispose();
            done();
          });
        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello'),
            ]),
          ),
        };
      }

      function main(sources: AppSources) {
        const component = isolate(Component)(sources);

        return { DOM: component.DOM };
      }

      function app(sources: AppSources) {
        return isolate(main)(sources);
      }

      const { sources, dispose } = Motorcycle.run<any, any>(app, {
        DOM: makeDomDriver(createRenderTarget()),
      });

      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
        const element: any = root.querySelector('.btn');
        assert.notStrictEqual(element, null);
        setTimeout(() => element.click());
      });


    });

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on child', (done) => {

      type AppSources = {
        DOM: DomSource,
      };
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click')
          .observe((ev: Event) => {
            assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON');
            dispose();
            done();
          });
        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello'),
            ]),
          ),
        };
      }

      function main(sources: AppSources) {
        const component = isolate(Component, 'foo')(sources);
        return { DOM: component.DOM };
      }

      function app(sources: AppSources) {
        return isolate(main)(sources);
      }

      const { sources, dispose } = Motorcycle.run<any, any>(app, {
        DOM: makeDomDriver(createRenderTarget()),
      });

      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
        const element: any = root.querySelector('.btn');
        assert.notStrictEqual(element, null);
        setTimeout(() => element.click());
      });

    });

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on parent', (done) => {

      type AppSources = {
        DOM: DomSource,
      };
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click')
          .observe((ev: Event) => {
            assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON');
            dispose();
            done();
          });
        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello'),
            ]),
          ),
        };
      }

      function main(sources: AppSources) {
        const component = isolate(Component)(sources);

        return { DOM: component.DOM };
      }

      function app(sources: AppSources) {
        return isolate(main, 'foo')(sources);
      }

      const { sources, dispose } = Motorcycle.run<any, any>(app, {
        DOM: makeDomDriver(createRenderTarget()),
      });

      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
        const element: any = root.querySelector('.btn');
        assert.notStrictEqual(element, null);
        setTimeout(() => element.click());
      });


    });

  it('should allow an isolated child to receive events when it is used as ' +
    'the vTree of an isolated parent component when scope is explicitly ' +
    'specified on parent and child', (done) => {

      type AppSources = {
        DOM: DomSource,
      };
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click')
          .observe((ev: Event) => {
            assert.strictEqual((ev.target as HTMLElement).tagName, 'BUTTON');
            dispose();
            done();
          });
        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello'),
            ]),
          ),
        };
      }

      function main(sources: AppSources) {
        const component = isolate(Component, 'bar')(sources);

        return { DOM: component.DOM };
      }

      function app(sources: AppSources) {
        return isolate(main, 'foo')(sources);
      }

      const { sources, dispose } = Motorcycle.run<any, any>(app, {
        DOM: makeDomDriver(createRenderTarget()),
      });

      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
        const element: any = root.querySelector('.btn');
        assert.notStrictEqual(element, null);
        setTimeout(() => element.click());
      });


    });

  it('should maintain virtual DOM list sanity using keys, in a list of ' +
    'isolated components', (done) => {
      const componentRemove$ = sync<null | number>();

      type AppSources = {
        DOM: DomSource,
      };
      function Component(sources: AppSources) {
        sources.DOM.select('.btn').events('click').observe(() => {
          componentRemove$.next(null);
        });

        return {
          DOM: most.of(
            div('.component', {}, [
              button('.btn', {}, 'Hello'),
            ]),
          ),
        };
      }

      function main(sources: AppSources) {
        const remove$ = componentRemove$.scan((acc) => acc + 1, 0);
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

      const { sources, dispose } = Motorcycle.run<any, any>(main, {
        DOM: makeDomDriver(createRenderTarget()),
      });


      sources.DOM.elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
        const components = root.querySelectorAll('.btn');
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

    });
});