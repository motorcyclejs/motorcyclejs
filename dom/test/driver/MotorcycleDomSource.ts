import * as assert from 'assert';
import { empty, just } from 'most';
import { DomSource, div, button } from '../../src';
import * as h from 'hyperscript';
import { MotorcycleDomSource } from '../../src/dom-driver/DomSources';
import { IsolateModule } from '../../src/modules/IsolateModule';
import { SCOPE_PREFIX } from '../../src/dom-driver/DomSources/common';

describe('MotorcycleDomSource', () => {
  it('implements DomSource interface', () => {
    const domSource: DomSource = new MotorcycleDomSource(empty(), []);
    assert.strictEqual(typeof domSource.select, 'function');
    assert.strictEqual(typeof domSource.elements, 'function');
    assert.strictEqual(typeof domSource.events, 'function');
    assert.strictEqual(typeof domSource.isolateSink, 'function');
    assert.strictEqual(typeof domSource.isolateSource, 'function');
  });

  describe('select', () => {
    it('appends to namespace', () => {
      const domSource: DomSource = new MotorcycleDomSource(empty(), []);
      const namespace = domSource.select('hello').namespace();

      assert.deepEqual(namespace, ['hello']);
    });

    it('does not append to namespace when given `:root`', () => {
      const domSource: DomSource = new MotorcycleDomSource(empty(), []);
      const namespace = domSource.select(':root').namespace();

      assert.deepEqual(namespace, []);
    });
  });

  describe('elements', () => {
    describe('with an empty namespace', () => {
      it('returns an array containing given root element', () => {
        const element = document.createElement('div');
        const domSource = new MotorcycleDomSource(just(element), []);

        return domSource.elements().observe(([root]) => {
          assert.strictEqual(root, element);
        });
      });
    });

    describe('with non-empty namespace', () => {
      describe('with no previous select', () => {
        it('returns an array of most specific element', () => {
          const element = document.createElement('div');
          const scope = SCOPE_PREFIX + '1';

          const wrongElement = document.createElement('div');

          const isolatedElement = document.createElement('div');
          isolatedElement.setAttribute('data-isolate', scope);

          element.appendChild(wrongElement);
          element.appendChild(isolatedElement);

          const domSource = new MotorcycleDomSource(just(element), [scope]);

          return domSource.elements().observe(elements => {
            assert.strictEqual(elements.length, 1);
            assert.strictEqual(elements[0].tagName, 'DIV');
            assert.notStrictEqual(elements[0], element, 'Should not match rootElement');
            assert.notStrictEqual(elements[0], wrongElement, 'Should not match non-isolated element');
            assert.strictEqual(elements[0], isolatedElement);
          });
        });
      });

      it('returns an array of elements matching a given selector', () => {
        const element = h('div', h('i.hello'), h('a.hello'), h('b.hello'), h('a.hello2'));
        const domSource = new MotorcycleDomSource(just(element), []);

        return domSource.select('.hello').elements().observe(elements => {
          assert.strictEqual(elements.length, 3);
          const [i, a, b] = elements;
          assert.strictEqual(i.tagName, 'I');
          assert.strictEqual(a.tagName, 'A');
          assert.strictEqual(b.tagName, 'B');
        });
      });

      it('does not return elements outside of a given scope', () => {
        const element = h('div',
          h('div.foo', h('h2.baz')),
          h('div.bar', h('h2.baz')),
        );

        const domSource = new MotorcycleDomSource(just(element), ['.foo']);

        return domSource.select('.baz').elements().observe(elements => {
          assert.strictEqual(elements.length, 1);
        });
      });

      it('returns svg elements', (done) => {
        const svgElement = document.createElementNS(`http://www.w3.org/2000/svg`, 'svg');
        svgElement.setAttribute('className', 'triangle');

        try {
          svgElement.classList.add('triangle');
        } catch (e) {
          // done();
        }

        const element = h('div', svgElement);
        const domSource = new MotorcycleDomSource(just(element), ['.triangle']);

        domSource.elements()
          .observe(elements => {
            assert.strictEqual(elements.length, 1);
            assert.strictEqual(elements[0], svgElement);
            done();
          })
          .catch(done);
      });
    });
  });

  describe('events', () => {
    it('should capture events from elements', (done) => {
      const element = h('div', [
        h('button', { className: 'btn' }),
      ]);

      const domSource = new MotorcycleDomSource(just(element), ['.btn']);

      domSource.events('click')
        .observe(ev => {
          assert.ok(ev instanceof Event);
          assert.strictEqual(ev.type, 'click');
          done();
        })
        .catch(done);

      domSource.elements().observe((elements) => {
        assert.strictEqual(elements.length, 1);

        (elements[0] as any).click();
      });
    });

    it('should only create 1 event listener per event type', (done) => {
      const element = h('div', [
        h('button', { className: 'btn' }),
      ]);

      let called = 0;

      element.addEventListener = function () {
        ++called;
      };

      const domSource = new MotorcycleDomSource(just(element), ['.btn']);

      domSource.events('click').drain();
      domSource.events('click').drain();

      domSource.elements()
        .observe(() => {
          assert.strictEqual(called, 1);
          done();
        })
        .catch(done);
    });

    it('removes listener when event streams end', (done) => {
      const element = h('div', [
        h('button', { className: 'btn' }),
      ]);

      let called = 0;

      element.removeEventListener = function () {
        ++called;
      };

      const domSource = new MotorcycleDomSource(just(element), ['.btn']);

      domSource.events('click').take(1).drain();
      domSource.events('click').take(2).drain();

      domSource.elements().observe(elements => {
        const btn: any = elements[0];

        btn.click();
        btn.click();

        setTimeout(() => {
          assert.strictEqual(called, 1);
          done();
        });
      });
    });

    it('captures events using id', (done) => {
      const element = h('div', { id: 'myElement' }, [
        h('button', { id: 'btn' }),
      ]);

      const domSource = new MotorcycleDomSource(just(element), ['#btn']);

      domSource.events('click').observe(ev => {
        assert.strictEqual(ev.type, 'click');
        assert.strictEqual((ev.target as HTMLElement).id, 'btn');
        done();
      });

      setTimeout(() => {
        (element.querySelector('#btn') as any).click();
      });
    });

    it('captures rootElement events using id', (done) => {
      const element = h('div', { id: 'myElement' }, [
        h('button', { id: 'btn' }),
      ]);

      const domSource = new MotorcycleDomSource(just(element), ['#myElement']);

      domSource.events('click').observe(ev => {
        assert.strictEqual(ev.type, 'click');
        assert.strictEqual((ev.target as HTMLElement).id, 'myElement');
        done();
      });

      setTimeout(() => {
        element.click();
      });
    });

    it('captures events from multiple elements', (done) => {
      const element = h('div', {}, [
        h('button.clickable.first', {}, 'first'),
        h('button.clickable.second', {}, 'second'),
      ]);

      const domSource = new MotorcycleDomSource(just(element), ['.clickable']);

      domSource.events('click').take(1).observe(ev => {
        assert.strictEqual((ev.target as HTMLElement).textContent, 'first');
      });

      domSource.events('click').skip(1).take(1).observe(ev => {
        assert.strictEqual((ev.target as HTMLElement).textContent, 'second');
        done();
      });

      setTimeout(() => {
        (element.querySelector('.first') as any).click();
        (element.querySelector('.second') as any).click();
      });
    });

    it('captures non-bubbling events', () => {
      const form = h('form.form', [
        h('input', { type: 'text' }),
      ]);

      const element = h('div', {}, [form]);

      const domSource = new MotorcycleDomSource(just(element), ['.form']);

      setTimeout(() => {
        form.dispatchEvent(new Event('reset', { bubbles: false }));
      });

      return domSource.events('reset').take(1).observe(ev => {
        assert.strictEqual(ev.type, 'reset');
      });
    });
  });

  describe('isolateSink', () => {
    it('adds isolation information to vNode', () => {
      const buttonElement = h('button', { className: 'btn' }) as HTMLButtonElement;
      const divElement = h('div', [buttonElement]) as HTMLDivElement;

      const btn = button('.btn');
      const vNode = div({}, [btn]);

      btn.elm   = buttonElement;
      vNode.elm = divElement;

      const vNode$ = just(vNode);

      const domSource = new MotorcycleDomSource(just(divElement), []);

      return domSource.isolateSink(vNode$, `hello`).observe(vNode => {
        assert.strictEqual(vNode.data && vNode.data.isolate, `$$MOTORCYCLEDOM$$-hello`);
      });
    });
  });

  describe('isolateSource', () => {
    it('returns a new DomSource with amended namespace', () => {
      const domSource = new MotorcycleDomSource(just(h('div')), []);

      assert.deepEqual(domSource.isolateSource(domSource, 'hello').namespace(), ['$$MOTORCYCLEDOM$$-hello']);
    });
  });

  describe('isolation', () => {
    it('prevents parent from DOM.selecting() inside the isolation', function () {
      const isolatedButton = h('button.btn', {}, []) as HTMLButtonElement;
      const isolatedButtonVNode = button('.btn');
      isolatedButtonVNode.elm = isolatedButton;

      const isolatedDiv = h('div', {}, [isolatedButton]) as HTMLDivElement;
      const isolatedDivVNode = div({ isolate: '$$MOTORCYCLEDOM$$-foo' }, [isolatedButtonVNode]);
      isolatedDivVNode.elm = isolatedDiv;

      const buttonElement = h('button.btn', {}, []) as HTMLButtonElement;
      const buttonVNode = button('.btn');
      buttonVNode.elm = buttonElement;

      const divElement = h('div', {}, [buttonElement]) as HTMLDivElement;
      const divVNode = div({}, [buttonVNode]);
      divVNode.elm = divElement;

      const parentDiv = h('div', {}, [divElement, isolatedDiv]) as HTMLDivElement;
      const parentDivVNode = div({}, [divVNode, isolatedDivVNode]);
      parentDivVNode.elm = parentDiv;

      const isolateModule = new IsolateModule();

      isolateModule.create(isolatedDivVNode, isolatedDivVNode);
      isolateModule.create(isolatedButtonVNode, isolatedButtonVNode);

      assert.strictEqual(isolatedButton.getAttribute('data-isolate'), '$$MOTORCYCLEDOM$$-foo');

      const domSource = new MotorcycleDomSource(just(parentDiv), []);
      const isolatedDomSource = domSource.isolateSource(domSource, 'foo');

      domSource.select('.btn').events('click').observe(() => {
        throw new Error('Parent event listener should not receive isolated event');
      });

      setTimeout(() => {
        isolatedButton.click();
      });

      return isolatedDomSource.select('.btn').events('click').take(1).observe((ev) => {
        assert.strictEqual(ev.target, isolatedButton);
      });
    });
  });
});
