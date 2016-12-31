import * as assert from 'assert';
import * as i18next from 'i18next';

import { concat, delay, empty, just } from 'most';

import { join } from 'path'
import { makeI18nDriver } from './makeI18nDriver';

const options: any =
  {
    "load": `currentOnly`,
    "fallbackLng": false,
  };

const plugin = (function () {
  try {
    if (window && window.console)
      return require('i18next-xhr-backend')
  } catch (e) {
    options.backend =
      {
        loadPath: join(__dirname, '__test__/locales/{{lng}}/{{ns}}.json'),
      };

    return require('i18next-node-fs-backend')
  }
})()

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
            const languages$ = concat(
              just(`da-DK`),
              delay(100, just(`es-ES`)),
            );

            const stream = makeI18nDriver([plugin], options)(languages$)('hello');

            const expected = ['hej', 'hola'];

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
