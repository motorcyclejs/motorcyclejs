import * as assert from 'assert';
import { div, h } from '../../src';
import { vNodeWrapper } from '../../src/dom-driver/vNodeWrapper';

describe('vNodeWrapper', () => {
  it('wraps a vNode in a vNode representation of an element', () => {
    const divElement = document.createElement('div');
    const vNode = h('h1', {}, 'Hello');
    const { elm, children } = vNodeWrapper(divElement)(vNode);

    assert.strictEqual(divElement, elm);
    assert.strictEqual(children && children[0], vNode);
  });

  it('returns a vNode if identical to rootElement', () => {
    const element = document.createElement('div');
    const vNode = div();

    assert.strictEqual(vNodeWrapper(element)(vNode), vNode);
  });
});
