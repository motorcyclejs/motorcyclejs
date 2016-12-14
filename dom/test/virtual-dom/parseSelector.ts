import * as assert from 'assert';
import { parseSelector } from '../../src/virtual-dom/helpers/h';

describe('parseSelector', () => {
  it('parses selectors', () => {
    let result = parseSelector('p');
    assert.deepEqual(result, { tagName: 'p', id: '', className: '' });

    result = parseSelector('p#foo');
    assert.deepEqual(result, { tagName: 'p', id: 'foo', className: '' });

    result = parseSelector('p.bar');
    assert.deepEqual(result, { tagName: 'p', id: '', className: 'bar' });

    result = parseSelector('p.bar.baz');
    assert.deepEqual(result, { tagName: 'p', id: '', className: 'bar baz' });

    result = parseSelector('p#foo.bar.baz');
    assert.deepEqual(result, { tagName: 'p', id: 'foo', className: 'bar baz' });

    result = parseSelector('div#foo');
    assert.deepEqual(result, { tagName: 'div', id: 'foo', className: '' });

    result = parseSelector('div#foo.bar.baz');
    assert.deepEqual(result, { tagName: 'div', id: 'foo', className: 'bar baz' });

    result = parseSelector('div.bar.baz');
    assert.deepEqual(result, { tagName: 'div', id: '', className: 'bar baz' });
  });
});
