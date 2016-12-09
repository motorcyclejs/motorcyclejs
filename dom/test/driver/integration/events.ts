import * as assert from 'assert';
import * as Motorcycle from '@motorcycle/core';
import { div, h4, h3, h2, span, form, input, makeDomDriver } from '../../../src';
import * as most from 'most';
import { createRenderTarget } from '../../helpers';

describe('DOMSource.events()', function () {
  it('should catch a basic click interaction Observable', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar')),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click());
      });
    });

  });

  it('should setup click detection with events() after run() occurs', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.test2.myelementclass', 'Foobar')),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    setTimeout(() => {
      const myElement = document.querySelector('.test2.myelementclass') as HTMLElement;
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => (myElement as any).click());
      });
    }, 200);
  });

  it('should setup click detection on a ready DOM element (e.g. from server)', function (done) {
    function app() {
      return {
        DOM: most.never(),
      };
    }

    const containerElement = createRenderTarget();
    let headerElement = document.createElement('H3');
    headerElement.className = 'myelementclass';
    headerElement.textContent = 'Foobar';
    containerElement.appendChild(headerElement);

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(containerElement),
    });

    sources.DOM.select('.myelementclass').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });
    // Make assertions
    setTimeout(() => {
      const myElement = containerElement.querySelector('.myelementclass') as HTMLElement;
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => (myElement as any).click());
      });
    }, 200);
  });

  it('should catch events using id of root element in DOM.select', function (done) {
    function app() {
      return {
        DOM: most.of(h3('.myelementclass', 'Foobar')),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget('parent-001')),
    });


    // Make assertions
    sources.DOM.select('#parent-001').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click());
      });
    });

  });

  it('should catch events using id of top element in DOM.select', function (done) {
    function app() {
      return {
        DOM: most.of(h3('#myElementId', 'Foobar')),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget('parent-002')),
    });


    // Make assertions
    sources.DOM.select('#myElementId').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1)
      .observe(function ([root]: HTMLElement[]) {
        const myElement: any = root.querySelector('#myElementId');
        assert.notStrictEqual(myElement, null);
        assert.notStrictEqual(typeof myElement, 'undefined');
        assert.strictEqual(myElement.tagName, 'H3');
        assert.doesNotThrow(function () {
          setTimeout(() => myElement.click());
        });
      });

  });

  it('should catch interaction events without prior select()', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          h3('.myelementclass', 'Foobar'),
        ])),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    // Make assertions
    sources.DOM.events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Foobar');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(function ([root]: HTMLElement[]) {
      const myElement: any = root.querySelector('.myelementclass');
      assert.notStrictEqual(myElement, null);
      assert.notStrictEqual(typeof myElement, 'undefined');
      assert.strictEqual(myElement.tagName, 'H3');
      assert.doesNotThrow(function () {
        setTimeout(() => myElement.click());
      });
    });

  });

  it('should catch user events using DOM.select().select().events()', function (done) {
    function app() {
      return {
        DOM: most.of(
          h3('.top-most', [
            h2('.bar', 'Wrong'),
            div('.foo', [
              h4('.bar', 'Correct'),
            ]),
          ]),
        ),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });


    // Make assertions
    sources.DOM.select('.foo').select('.bar').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Correct');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(1).take(1)
      .observe(function ([root]: HTMLElement[]) {
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

  });

  it('should catch events from many elements using DOM.select().events()', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          h4('.clickable.first', 'First'),
          h4('.clickable.second', 'Second'),
        ])),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });


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
      .observe(function ([root]: HTMLElement[]) {
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

  });

  it('should catch interaction events from future elements', function (done) {
    function app() {
      return {
        DOM: most.concat(
          most.of(h2('.blesh', 'Blesh')),
          most.of(h3('.blish', 'Blish')).delay(100),
        ).concat(most.of(h4('.blosh', 'Blosh')).delay(100)),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget('parent-002')),
    });


    // Make assertions
    sources.DOM.select('.blosh').events('click').observe((ev: Event) => {
      assert.strictEqual(ev.type, 'click');
      assert.strictEqual((ev.target as HTMLHeadElement).textContent, 'Blosh');
      dispose();
      done();
    });

    sources.DOM.select(':root').elements().skip(3).take(1)
      .observe(function ([root]: HTMLElement[]) {
        const myElement: any = root.querySelector('.blosh');
        assert.notStrictEqual(myElement, null);
        assert.notStrictEqual(typeof myElement, 'undefined');
        assert.strictEqual(myElement.tagName, 'H4');
        assert.strictEqual(myElement.textContent, 'Blosh');
        assert.doesNotThrow(function () {
          setTimeout(() => myElement.click());
        });
      });

  });

  it('should catch a non-bubbling click event with useCapture', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          div('.clickable', 'Hello'),
        ])),
      };
    }

    function click (el: HTMLElement) {
      const ev: any = document.createEvent(`MouseEvent`);
      ev.initMouseEvent(
        `click`,
        false /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null,
      );
      el.dispatchEvent(ev);
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
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

    sources.DOM.select(':root').elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
      const clickable: any = root.querySelector('.clickable');
      setTimeout(() => click(clickable));
    });
    ;
  });

  it('should catch a blur event with useCapture', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          input('.correct', { props: { type: 'text' } }, []),
          input('.wrong', { props: { type: 'text' } }, []),
          input('.dummy', { props: { type: 'text' } }),
        ])),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    sources.DOM.select('.correct').events('blur', {useCapture: true})
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'blur');
        assert.strictEqual((ev.target as HTMLElement).className, 'correct');
        done();
      });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
      const correct: any = root.querySelector('.correct');
      const wrong: any = root.querySelector('.wrong');
      const dummy: any = root.querySelector('.dummy');
      setTimeout(() => wrong.focus(), 50);
      setTimeout(() => dummy.focus(), 100);
      setTimeout(() => correct.focus(), 150);
      setTimeout(() => dummy.focus(), 200);
    });
    ;
  });

  it('should catch a blur event by default (no options)', function (done) {
    function app() {
      return {
        DOM: most.of(div('.parent', [
          input('.correct', { props: { type: 'text' } }, []),
          input('.wrong', { props: { type: 'text' } }, []),
          input('.dummy', { props: { type: 'text' } }),
        ])),
      };
    }

    const { sources, dispose } = Motorcycle.run<any, any>(app, {
      DOM: makeDomDriver(createRenderTarget()),
    });

    sources.DOM.select('.correct').events('blur')
      .observe((ev: Event) => {
        assert.strictEqual(ev.type, 'blur');
        assert.strictEqual((ev.target as HTMLElement).className, 'correct');
        done();
      });

    sources.DOM.select(':root').elements().skip(1).take(1).observe(([root]: HTMLElement[]) => {
      const correct: any = root.querySelector('.correct');
      const wrong: any = root.querySelector('.wrong');
      const dummy: any = root.querySelector('.dummy');
      setTimeout(() => wrong.focus(), 50);
      setTimeout(() => dummy.focus(), 100);
      setTimeout(() => correct.focus(), 150);
      setTimeout(() => dummy.focus(), 200);
    });
  });
});