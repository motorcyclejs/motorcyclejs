import * as assert from 'assert';
import { Stream, Subscriber } from 'most';
import { sync } from 'most-subject';
import { makeMemoryHistoryDriver, Location } from '../../src';

describe(`memoryHistoryDriver`, () => {
  it('should create a location from pathname', (done) => {
    const { next, listen } = buildTest();

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, '/test');
        done();
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => { next('/test'); }, 0);
  });

  it('should create a location from PushHistoryInput', (done) => {
    const { next, listen } = buildTest();

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, '/test');
        done();
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => {
      next({ type: 'push', pathname: '/test' });
    }, 0);
  });

  it('should create a location from ReplaceHistoryInput', (done) => {
    const { next, listen } = buildTest();

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, '/test');
        done();
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => { next({ type: 'replace', pathname: '/test' }); }, 0);
  });

  it('should allow going back a route with type `go`', (done) => {
    const { next, listen } = buildTest();

    const expected = [
      '/test',
      '/other',
      '/test',
    ];

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, expected.shift());
        if (expected.length === 0) {
          done();
        }
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => {
      next('/test');
      next('/other');
      next({ type: 'go', amount: -1 });
    }, 0);
  });

  it('should allow going back a route with type `goBack`', (done) => {
    const { next, listen } = buildTest();

    const expected = [
      '/test',
      '/other',
      '/test',
    ];

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, expected.shift());
        if (expected.length === 0) {
          done();
        }
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => {
      next('/test');
      next('/other');
      next({ type: 'goBack' });
    }, 0);
  });

  it('should allow going forward a route with type `go`', (done) => {
    const { next, listen } = buildTest();

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ];

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, expected.shift());
        if (expected.length === 0) {
          done();
        }
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => {
      next('/test');
      next('/other');
      next({ type: 'go', amount: -1 });
      next({ type: 'go', amount: 1 });
    }, 0);
  });

  it('should allow going forward a route with type `goForward`', (done) => {
    const { next, listen } = buildTest();

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ];

    listen({
      next (location: Location) {
        assert.strictEqual(location.pathname, expected.shift());
        if (expected.length === 0) {
          done();
        }
      },
      error: done,
      complete: () => void 0,
    });

    setTimeout(() => {
      next('/test');
      next('/other');
      next({ type: 'go', amount: -1 });
      next({ type: 'goForward' });
    }, 0);
  });
});

function buildTest () {

  const stream = sync<any>();

  const next = (x: any) => stream.next(x);

  const historyDriver = makeMemoryHistoryDriver();

  const history$ = historyDriver(stream);

  function listen (observer: any) {
    const noopObserver = {
      next: () => void 0,
      error: () => void 0,
      complete: () => void 0,
    };

    // skip 1 to avoid initial
    return history$.skip(1).subscribe(Object.assign({}, noopObserver, observer));
  }

  return { next, listen };
}