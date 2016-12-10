import * as assert from 'assert';
import { Stream, Subscriber } from 'most';
import { async } from 'most-subject';
import { historyDriver, Location, HistoryInput } from '../../src';

window.onpopstate = function (ev) {
  ev.preventDefault();
};

describe(`historyDriver`, () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('should create a location from pathname', (done) => {
    const { stream, listen } = buildTest(done);

    listen(function (location: Location) {
      assert.strictEqual(location.path, '/test');
    });

    stream.next('/test');
    stream.complete();
  });

  it('should create a location from PushHistoryInput', (done) => {
    const { stream, listen } = buildTest(done);

    listen(function (location: Location) {
      assert.strictEqual(location.path, '/test');
    });

    stream.next({ type: 'push', pathname: '/test' });
    stream.complete();
  });

  it('should create a location from ReplaceHistoryInput', (done) => {
    const { stream, listen } = buildTest(done);

    listen(function (location: Location) {
      assert.strictEqual(location.path, '/test');
    });

    stream.next({ type: 'replace', pathname: '/test' });
    stream.complete();
  });

  it('should allow going back a route with type `go`', (done) => {
    const { stream, listen } = buildTest(done);

    const expected = [
      '/test',
      '/other',
      '/test',
    ];

    listen(function (location: Location) {
      assert.strictEqual(location.path, expected.shift());
    });

    stream.next('/test');
    stream.next('/other');
    stream.next({ type: 'go', amount: -1 });
    stream.complete();
  });

  it('should allow going back a route with type `goBack`', (done) => {
    setTimeout(() => {
      const { stream, listen } = buildTest(done);

      const expected = [
        '/test',
        '/other',
        '/test',
      ];

      listen(function (location: Location) {
        assert.strictEqual(location.path, expected.shift());
      });

      stream.next('/test');
      stream.next('/other');
      stream.next({ type: 'goBack' });
      stream.complete();
    });
  });

  it('should allow going forward a route with type `go`', (done) => {
    const { stream, listen } = buildTest(done);

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ];

    listen(function (location: Location) {
      assert.strictEqual(location.path, expected.shift());
    });

    stream.next('/test');
    stream.next('/other');
    stream.next({ type: 'go', amount: -1 });
    stream.next({ type: 'go', amount: 1 });
    stream.complete();
  });

  it('should allow going forward a route with type `goForward`', (done) => {
    const { stream, listen } = buildTest(done);

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ];

    listen(function (location: Location) {
      assert.strictEqual(location.path, expected.shift());
      if (expected.length === 0) {
        done();
      }
    });

    stream.next('/test');
    stream.next('/other');
    stream.next({ type: 'go', amount: -1 });
    stream.next({ type: 'goForward' });
    stream.complete();
  });
});

function buildTest (done: Function) {
  const stream = async<any>();

  const send = (x: HistoryInput | string) => stream.next(x);

  const history$ = historyDriver(stream.continueWith(() => {
    done();
    return stream;
  }));

  function listen (next: (location: Location) => any) {
    const observer = {
      next,
      error: (err: Error) => done(err),
      complete: () => done(),
    };

    // skip 1 to avoid initial
    return history$.skip(1).subscribe(observer);
  }

  return { listen, stream };
}