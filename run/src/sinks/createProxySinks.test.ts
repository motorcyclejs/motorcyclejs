import * as assert from 'assert';
import { Stream, just } from 'most';
import { sync } from 'most-subject';
import { createProxySinks } from './createProxySinks';

describe('createProxySinks', () => {
  it('is a function', () => {
    assert.strictEqual(typeof createProxySinks, 'function');
  });

  it('returns an object', () => {
    assert.strictEqual(typeof createProxySinks(), 'object');
  });

  describe('return object', () => {
    it('allows accessing properties', () => {
      const sinks = createProxySinks<{ dom: Stream<number> }>();

      assert.strictEqual(typeof sinks.dom.observe, 'function');
    });

    it('should return true with `for .. in` syntax', () => {
      const sinks = createProxySinks<{ dom: Stream<number> }>();

      assert.ok('dom' in sinks);
      assert.ok('http' in sinks);
    });

    it('should allow setting new values', () => {
      const sinks = createProxySinks<{ dom: Stream<number> }>();

      assert.doesNotThrow(() => {
        sinks.dom = just(1);
      });
    });
  });
});
