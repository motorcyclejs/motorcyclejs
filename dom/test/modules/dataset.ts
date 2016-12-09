import * as assert from 'assert';
import fakeRaf from '../helpers/fake-raf';
import { init, h, DatasetModule } from '../../src';

fakeRaf.use();
const patch = init([ DatasetModule ]);

// doesnt work because jsdom does not support dataset
describe.skip('dataset', function() {
  let element: HTMLElement, vnode0: HTMLElement;
  beforeEach(function() {
    element = document.createElement('div');
    vnode0 = element;
  });
  it('is set on initial element creation', function() {
    element = patch(vnode0, h('div', {dataset: {foo: 'foo'}})).elm as HTMLElement;
    assert.equal(element.dataset['foo'], 'foo');
  });
  it('updates dataset', function() {
    const vnode1 = h('i', {dataset: {foo: 'foo', bar: 'bar'}});
    const vnode2 = h('i', {dataset: {baz: 'baz'}});
    element = patch(vnode0, vnode1).elm as HTMLElement;
    assert.equal(element.dataset['foo'], 'foo');
    assert.equal(element.dataset['bar'], 'bar');
    element = patch(vnode1, vnode2).elm as HTMLElement;
    assert.equal(element.dataset['baz'], 'baz');
    assert.equal(element.dataset['foo'], undefined);
  });
  it('handles string conversions', function() {
    const vnode1 = h('i', {
      dataset: { empty: '', dash: '-', dashed: 'foo-bar', camel: 'fooBar', integer: 0, float: 0.1 },
    });
    element = patch(vnode0, vnode1).elm as HTMLElement;

    assert.equal(element.dataset['empty'], '');
    assert.equal(element.dataset['dash'], '-');
    assert.equal(element.dataset['dashed'], 'foo-bar');
    assert.equal(element.dataset['camel'], 'fooBar');
    assert.equal(element.dataset['integer'], '0');
    assert.equal(element.dataset['float'], '0.1');
  });

});

fakeRaf.restore();
