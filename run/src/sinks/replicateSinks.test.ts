import * as assert from 'assert';
import * as sinon from 'sinon';
import { just, throwError } from 'most';
import { sync } from 'most-subject';
import { replicateSinks } from './replicateSinks';

describe('replicateSinks', () => {
  describe('given sinks and sinkProxies', () => {
    it('subscribes to sinks and replicates values in sinkProxies', () => {
      const sinks = {
        other: just(2),
      };

      const sinkProxies = {
        other: sync<number>(),
      };

      replicateSinks(sinks, sinkProxies);

      return sinkProxies.other.observe((n: number) => {
        assert.strictEqual(n, 2);
      });
    });

    it('only subscribes to sinks with matching drivers', () => {
      let testSubscribed = false;
      let otherSubscribed = false;

      const test = just(1).tap(() => {
        testSubscribed = true;
      });

      const other = just(2).tap(() => {
        otherSubscribed = true;
      });

      const sinks = { test, other };

      const sinkProxies = { test: sync<any>() };

      replicateSinks(sinks as any, sinkProxies);

      setTimeout(() => {
        assert.ok(testSubscribed);
        assert.ok(!otherSubscribed);
      }, 10);
    });

    it('logs errors from sinks to console', (done) => {
      const sandbox = sinon.sandbox.create();
      const stub = sandbox.stub(console, 'error');

      const sinks = {
        other: throwError(new Error('malfunction')),
      };

      const sinkProxies = {
        other: sync<any>(),
      };

      replicateSinks(sinks, sinkProxies);

      setTimeout(() => {
        assert.strictEqual(stub.callCount, 1);
        sandbox.restore();
        done();
      }, 10);
    });
  });
});
