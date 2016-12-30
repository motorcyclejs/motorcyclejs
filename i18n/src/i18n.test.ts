import * as assert from 'assert';
import { empty, from } from 'most';
import { makeI18nDriver } from './makeI18nDriver';

describe('makeI18nDriver', () => {
  it('returns a driver function', () => {
    assert.strictEqual(typeof makeI18nDriver(), 'function');
  });

  describe('driver function', () => {
    describe('given a stream of languages', () => {
      it('returns a source function', () => {
        assert.strictEqual(typeof makeI18nDriver()(empty()), 'function');
      });
    });

    describe('source function', () => {
      it('returns a stream', () => {
        const stream = makeI18nDriver()(empty())('');

        assert.strictEqual(typeof stream.observe, 'function');
      });

      describe('source stream', () => {
        describe('given a key of type string as input', () => {
          it('returns a stream of translations', (done: any) => {
            const languages$ = from<string>(['en-US', 'es-ES']);

            const stream = makeI18nDriver()(languages$)('hello');

            const expected = [ 'hello', 'hola' ];

            stream
              .observe(str => {
                assert.strictEqual(str, expected.shift());

                if (expected.length === 0)
                  done();
              })
              .catch(done);
          });
        });
      });
    });
  });
});
