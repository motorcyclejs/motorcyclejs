import * as assert from 'assert';
import { unsubscribeSubscriptions } from './unsubscribeSubscriptions';

describe('unsubscribeSubscriptions', () => {
  describe('given an array of subscriptions', () => {
    it('calls their unsubscribe methods', () => {
      let called = false;

      const subscriptions = [
        { unsubscribe() { called = true; } },
      ];

      unsubscribeSubscriptions(subscriptions);

      assert.ok(called);
    });
  });
});
