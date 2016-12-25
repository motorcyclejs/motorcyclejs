import * as assert from 'assert';
import { disposeSources } from './disposeSources';

describe('disposeSource', () => {
  describe('given a Source with dispose method', () => {
    it('calls Source\'s dispose method', () => {
      let called = 0;

      const source = {
        dispose() {
          ++called;
        },
      };

      const sources = { source };

      disposeSources(sources);

      assert.strictEqual(called, 1);
    });
  });
});
