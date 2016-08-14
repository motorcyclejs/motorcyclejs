/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import Cycle from '@cycle/most-run'
import { div, h4, h3, h2, span, form, input, makeDOMDriver } from '../../src/index'
import * as most from 'most'
import { createRenderTarget } from '../helpers'

describe('DOMSource.events()', function () {
  it('should catch a basic click interaction Observable', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    let dispose: Function;
    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click())
      });
    });
    dispose = run();
  });

  it('should setup click detection with events() after run() occurs', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.test2.myelementclass', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });
    let dispose = run();
    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    setTimeout(() => {
      const myElement = document.querySelector('.test2.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => (myElement as any).click())
      });
    }, 200);
  });

  it('should setup click detection on a ready DOM element (e.g. from server)', function (done) {
    function app() {
      return {
        DOM: most.never()
      };
    }

    const containerElement = createRenderTarget();
    let headerElement = document.createElement('H3');
    headerElement.className = 'myelementclass';
    headerElement.textContent = 'Foobar';
    containerElement.appendChild(headerElement);

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(containerElement)
    });
    let dispose = run();
    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    setTimeout(() => {
      const myElement = containerElement.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => (myElement as any).click())
      });
    }, 200);
  });

  it('should catch events using id of root element in DOM.select', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget('parent-001'))
    });

    let dispose: Function;
    // Make assertions
    sources.DOM.select('#parent-001').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click());
      });
    });
    dispose = run();
  });

  it('should catch events using id of top element in DOM.select', function (done) {
    function app() {
      return {
        DOM: most.of(h3('#myElementId', 'Foobar'))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget('parent-002'))
    });

    let dispose: Function;
    // Make assertions
    sources.DOM.select('#myElementId').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1)
      .observe(function (root: HTMLElement) {
        const myElement: any = root.querySelector('#myElementId');
        assert.notStrictEqual(myElement, null);
        assert.notStrictEqual(typeof myElement, 'undefined');
        assert.strictEqual(myElement.tagName, 'H3');
        assert.doesNotThrow(function () {
          setTimeout(() => myElement.click());
        });
      });
    dispose = run();
  });

  it('should catch interaction events without prior select()', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          h3('.myelementclass', 'Foobar')
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: Function;
    // Make assertions
    sources.DOM.events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click());
      });
    });
    dispose = run();
  });

  it('should catch user events using DOM.select().select().events()', function (done) {
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

    let dispose: Function;
    // Make assertions
    sources.DOM.select('.foo').select('.bar').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Correct');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1)
      .observe(function (root: HTMLElement) {
        const wrongElement: any = root.querySelector('.bar');
        const correctElement: any = root.querySelector('.foo .bar');
        assert.notStrictEqual(wrongElement, null);
        assert.notStrictEqual(correctElement, null);
        assert.notStrictEqual(typeof wrongElement, 'undefined');
        assert.notStrictEqual(typeof correctElement, 'undefined');
        assert.strictEqual(wrongElement.tagName, 'H2');
        assert.strictEqual(correctElement.tagName, 'H4');
        assert.doesNotThrow(function () {
          setTimeout(() => wrongElement.click());
          setTimeout(() => correctElement.click(), 15);
        });
      });
    dispose = run();
  });

  it('should catch events from many elements using DOM.select().events()', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          h4('.clickable.first', 'First'),
          h4('.clickable.second', 'Second'),
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: Function;
    // Make assertions
    sources.DOM.select('.clickable').events('click').take(1)
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'click');
        assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'First');
      });

    sources.DOM.select('.clickable').events('click').skip(1).take(1)
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'click');
        assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Second');
        dispose();
        done();
      });

    sources.DOM.select(':root').elements().skip(1).take(1)
      .observe(function (root: HTMLElement) {
        const firstElem: any = root.querySelector('.first');
        const secondElem: any = root.querySelector('.second');
        assert.notStrictEqual(firstElem, null);
        assert.notStrictEqual(typeof firstElem, 'undefined');
        assert.notStrictEqual(secondElem, null);
        assert.notStrictEqual(typeof secondElem, 'undefined');
        assert.doesNotThrow(function () {
          setTimeout(() => firstElem.click());
          setTimeout(() => secondElem.click(), 5);
        });
      });
    dispose = run();
  });

  it('should catch interaction events from future elements', function (done) {
    function app() {
      return {
        DOM: most.concat(
          most.of(h2('.blesh', 'Blesh')),
          most.of(h3('.blish', 'Blish')).delay(100),
        ).concat(most.of(h4('.blosh', 'Blosh')).delay(100))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget('parent-002'))
    });

    let dispose: Function;
    // Make assertions
    sources.DOM.select('.blosh').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Blosh');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(3).take(1)
      .observe(function (root: HTMLElement) {
        const myElement: any = root.querySelector('.blosh');
        assert.notStrictEqual(myElement, null);
        assert.notStrictEqual(typeof myElement, 'undefined');
        assert.strictEqual(myElement.tagName, 'H4');
        assert.strictEqual(myElement.textContent, 'Blosh');
        assert.doesNotThrow(function () {
          setTimeout(() => myElement.click());
        });
      });
    dispose = run();
  });

  it('should have currentTarget or ownerTarget pointed to the selected parent', function (done) {
    function app() {
      return {
        DOM: most.of(div('.top', [
          h2('.parent', [
            span('.child', 'Hello world')
          ])
        ]))
      };
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    let dispose: Function;
    sources.DOM.select('.parent').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLElement).tagName, 'SPAN');
      assert.strictEqual((ev.target as HTMLElement).className, 'child');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Hello world');
      const currentTargetIsParentH2 =
        (ev.currentTarget as HTMLElement).tagName === 'H2' && (ev.currentTarget as HTMLElement).className === 'parent';
      const ownerTargetIsParentH2 =
        (ev as any).ownerTarget.tagName === 'H2' && (ev as any).ownerTarget.className === 'parent';
      assert.strictEqual(currentTargetIsParentH2 || ownerTargetIsParentH2, true);
      dispose();
      done();
    });
    // Make assertions
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function (root: HTMLElement) {
      const child: any = root.querySelector('.child');
      assert.notStrictEqual(child, null);
      assert.notStrictEqual(typeof child, 'undefined');
      assert.strictEqual(child.tagName, 'SPAN');
      assert.strictEqual(child.className, 'child');
      assert.doesNotThrow(function () {
        setTimeout(() => child.click());
      });
    });
    dispose = run();
  });

  it('should catch a non-bubbling Form `reset` event', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          form('.form', [
            input('.field', {props: {type: 'text'}})
          ])
        ]))
      }
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.form').events('reset').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'reset');
      assert.strictEqual((ev.target as HTMLElement).tagName, 'FORM');
      assert.strictEqual((ev.target as HTMLElement).className, 'form');
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      const form: any = root.querySelector('.form');
      setTimeout(() => form.reset());
    });
    run()
  });

  it('should catch a non-bubbling click event with useCapture', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          div('.clickable', 'Hello')
        ]))
      }
    }

    function click (el: HTMLElement) {
      const ev: any = document.createEvent(`MouseEvent`)
      ev.initMouseEvent(
        `click`,
        false /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
      )
      el.dispatchEvent(ev)
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.clickable').events('click', {useCapture: true})
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'click');
        assert.strictEqual((ev.target as HTMLElement).tagName, 'DIV');
        assert.strictEqual((ev.target as HTMLElement).className, 'clickable');
        assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Hello');
        done();
      });

    sources.DOM.select('.clickable').events('click', {useCapture: false})
      .observe(assert.fail);

    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      const clickable: any = root.querySelector('.clickable');
      setTimeout(() => click(clickable));
    });
    run();
  });

  // This test does not work if and only if the browser is unfocused in the
  // operating system. In some browsers in SauceLabs, this test would always
  // fail for that reason. Until we find how to force the browser to be
  // focused, we can't run this test.
  it.skip('should catch a blur event with useCapture', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          input('.correct', { props: { type: 'text' } }, []),
          input('.wrong', { props: { type: 'text' } }, []),
          input('.dummy', { props: { type: 'text' } })
        ]))
      }
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.correct').events('blur', {useCapture: true})
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'blur');
        assert.strictEqual((ev.target as HTMLElement).className, 'correct');
        done();
      });

    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      const correct: any = root.querySelector('.correct');
      const wrong: any = root.querySelector('.wrong');
      const dummy: any = root.querySelector('.dummy');
      setTimeout(() => wrong.focus(), 50);
      setTimeout(() => dummy.focus(), 100);
      setTimeout(() => correct.focus(), 150);
      setTimeout(() => dummy.focus(), 200);
    });
    run()
  });

  // This test does not work if and only if the browser is unfocused in the
  // operating system. In some browsers in SauceLabs, this test would always
  // fail for that reason. Until we find how to force the browser to be
  // focused, we can't run this test.
  it.skip('should catch a blur event by default (no options)', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          input('.correct', { props: { type: 'text' } }, []),
          input('.wrong', { props: { type: 'text' } }, []),
          input('.dummy', { props: { type: 'text' } })
        ]))
      }
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.correct').events('blur')
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'blur');
        assert.strictEqual((ev.target as HTMLElement).className, 'correct');
        done();
      });

    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      const correct: any = root.querySelector('.correct');
      const wrong: any = root.querySelector('.wrong');
      const dummy: any = root.querySelector('.dummy');
      setTimeout(() => wrong.focus(), 50);
      setTimeout(() => dummy.focus(), 100);
      setTimeout(() => correct.focus(), 150);
      setTimeout(() => dummy.focus(), 200);
    });
    run();
  });

  it('should not simulate bubbling for non-bubbling events', done => {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          form('.form', [
            input('.field', { props: { type: 'text' } })
          ])
        ]))
      }
    }

    const {sources, run} = Cycle(app, {
      DOM: makeDOMDriver(createRenderTarget())
    });

    sources.DOM.select('.parent').events('reset').observe(() => {
      done(new Error('Reset event should not bubble to parent'));
    });

    sources.DOM.select('.form').events('reset').delay(200).observe((ev: Event) => {
      assert.strictEqual(ev.type, 'reset');
      assert.strictEqual((ev.target as HTMLElement).tagName, 'FORM');
      assert.strictEqual((ev.target as HTMLElement).className, 'form');
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe((root: HTMLElement) => {
      const form: any = root.querySelector('.form');
      setTimeout(() => form.reset());
    });
    run()
  });
});
