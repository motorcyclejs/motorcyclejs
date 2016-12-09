import * as assert from 'assert';
import { IsolateModule } from '../../src/modules/IsolateModule';
import { h } from '../../src';

describe('IsolateModule', () => {
  it('implements create and update hooks', () => {
    const isolateModule = new IsolateModule();

    assert.strictEqual(typeof isolateModule.create, 'function');
    assert.strictEqual(typeof isolateModule.update, 'function');
  });

  describe('create', () => {
    it('adds a new element to isolation', () => {
      const formerVNode = h('div', {}, []);
      formerVNode.elm = document.createElement('div');

      const vNode = h('div', { isolate: 'hello' }, []);
      const element = document.createElement('div');
      vNode.elm = element;

      const isolateModule = new IsolateModule();

      isolateModule.create(formerVNode, vNode);

      assert.strictEqual(element.getAttribute('data-isolate'), 'hello');
    });
  });

  describe('update', () => {
    it('adds a new element to isolation', () => {
      const formerVNode = h('div', {}, []);
      formerVNode.elm = document.createElement('div');

      const vNode = h('div', { isolate: 'hello' }, []);
      const element = document.createElement('div');
      vNode.elm = element;

      const isolateModule = new IsolateModule();

      isolateModule.update(formerVNode, vNode);

      assert.strictEqual(element.getAttribute('data-isolate'), 'hello');
    });
  });
});