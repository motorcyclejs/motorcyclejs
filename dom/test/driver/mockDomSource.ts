import * as assert from 'assert';
import { run } from '@motorcycle/core';
import { h4, h3, h2, div, h, mockDomSource, DomSource } from '../../src/index';
import * as most from 'most';

describe('mockDOMSource', function () {
  it('should be in accessible in the API', function () {
    assert.strictEqual(typeof mockDomSource, 'function');
  });

  it('should make an Observable for clicks on `.foo`', function (done) {
    const userEvents = mockDomSource({
      '.foo': {
        'click': most.of(135),
      },
    });
    userEvents.select('.foo').events('click').subscribe({
      next: ev => {
        assert.strictEqual(ev, 135);
        done();
      },
      error: err => done(err),
      complete: () => {},
    });
  });

  it('should make multiple user event Observables', function (done) {
    const userEvents = mockDomSource({
      '.foo': {
        'click': most.of(135),
      },
      '.bar': {
        'scroll': most.of(2),
      },
    });
    most.combine<number, number, number>(
      (a: number, b: number) => a * b,
      userEvents.select('.foo').events('click'),
      userEvents.select('.bar').events('scroll'),
    ).subscribe({
      next: ev => {
        assert.strictEqual(ev, 270);
        done();
      },
      error: err => done(err),
      complete: () => void 0,
    });
  });

  it('should make multiple user event Observables on the same selector', function (done) {
    const userEvents = mockDomSource({
      '.foo': {
        'click': most.of(135),
        'scroll': most.of(3),
      },
    });
    most.combine(
      (a: number, b: number) => a * b,
      userEvents.select('.foo').events('click'),
      userEvents.select('.foo').events('scroll'),
    ).subscribe({
      next: ev => {
        assert.strictEqual(ev, 405);
        done();
      },
      error: err => done(err),
      complete: () => void 0,
    });
  });

  it('should return an empty Observable if query does not match', function (done) {
    const userEvents = mockDomSource({
      '.foo': {
        'click': most.of(135),
      },
    });
    userEvents.select('.impossible').events('scroll')
      .subscribe({next: done, error: done, complete: done});
  });

  it('should return empty Observable for select().elements and none is defined', function (done) {
    const userEvents = mockDomSource({
      '.foo': {
        'click': most.of(135),
      },
    });
    userEvents.select('.foo').elements()
      .subscribe({next: assert.fail, error: assert.fail, complete: done});
  });

  it('should return defined Observable for select().elements', function (done) {
    const mockedDOMSource = mockDomSource({
      '.foo': {
        elements: most.of(135),
      },
    });
    mockedDOMSource.select('.foo').elements()
      .subscribe({
        next: (e: number) => {
          assert.strictEqual(e, 135);
          done();
        },
        error: (err: Error) => done(err),
        complete: () => void 0,
      });
  });

  it('should return defined Observable when chaining .select()', function (done) {
    const mockedDOMSource = mockDomSource({
      '.bar': {
        '.foo': {
          '.baz': {
            elements: most.of(135),
          },
        },
      },
    });
    mockedDOMSource.select('.bar').select('.foo').select('.baz').elements()
      .subscribe({
        next: (e: number) => {
          assert.strictEqual(e, 135);
          done();
        },
        error: (err: Error) => done(err),
        complete: () => void 0,
      });
  });

  it('multiple .select()s should not throw when given empty mockedSelectors', () => {
    assert.doesNotThrow(() => {
      const DOM = mockDomSource({});
      DOM.select('.something').select('.other').events('click');
    });
  });

  it('multiple .select()s should return some observable if not defined', () => {
    const DOM = mockDomSource({});
    const domSource = DOM.select('.something').select('.other');
    assert(domSource.events('click') instanceof most.Stream,'domSource.events(click) should be an Observable instance');
    assert.strictEqual(domSource.elements() instanceof most.Stream, true, 'domSource.elements() should be an Observable instance');
  });
});

describe('isolation on MockedDOMSource', function () {
  it('should have the same effect as DOM.select()', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div('.child.___foo', [
              h4('.bar', 'Correct'),
            ]),
          ]),
        ),
      };
    }

    const {sources, dispose} = run<any, any>(app, {
      DOM: () => mockDomSource({
        '.___foo': {
          '.bar': {
            elements: most.from(['skipped', 135]),
          },
        },
      }),
    });

    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');

    // Make assertions
    isolatedDOMSource.select('.bar').elements().skip(1).take(1).observe((elements: number) => {
      assert.strictEqual(elements, 135);
      setTimeout(() => {
        dispose();
        done();
      });
    });
  });

  it('should have isolateSource and isolateSink', function (done) {
    function app() {
      return {
        DOM: most.of(h('h3.top-most.___foo')),
      };
    }

    const {sources, dispose} = run<any, any>(app, {
      DOM: () => mockDomSource({}),
    });

    const isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, 'foo');
    // Make assertions
    assert.strictEqual(typeof isolatedDOMSource.isolateSource, 'function');
    assert.strictEqual(typeof isolatedDOMSource.isolateSink, 'function');
    dispose();
    done();
  });

  it('should prevent parent from DOM.selecting() inside the isolation', function (done) {
    type AppSources = {
      DOM: DomSource,
    };
    function app(sources: AppSources) {
      return {
        DOM: most.of(
          h3('.top-most', [
            sources.DOM.isolateSink(most.of(
              div('.foo', [
                h4('.bar', 'Wrong'),
              ]),
            ), 'ISOLATION'),
            h2('.bar', 'Correct'),
          ]),
        ),
      };
    }

    const {sources} = run(app, {
      DOM: () => mockDomSource({
        '.___ISOLATION': {
          '.bar': {
            elements: most.from(['skipped', 'Wrong']),
          },
        },
        '.bar': {
          elements: most.from(['skipped', 'Correct']),
        },
      }),
    });

    sources.DOM.select('.bar').elements().skip(1).take(1).observe(function (x: any) {
      assert.strictEqual(x, 'Correct');
      done();
    });
  });
});