import * as assert from 'assert';
import { Stream, periodic, of, never } from 'most';
import { makeRouterDriver, Router, RouterSource, HistoryInput, Location } from '../src';

describe('@motorcycle/router', function () {
  it('changes the route', (done) => {
    makeRouterDriver()(from(['/path'])).history().skip(1)
      .observe((location: Location) => {
        assert.strictEqual(location.pathname, '/path');
        done();
      })
      .catch(done);
  });

  describe('path()', () => {
    it('should filter the history$', () => {
      const routes = [
        '/somewhere/else',
        '/path/that/is/correct',
      ];

      const router = makeRouterDriver({ initialEntries: routes })(never()).path('/path');

      router.history().observe((location) => {
        assert.notStrictEqual(location.pathname, '/somewhere/else');
        assert.strictEqual(location.pathname, '/path/that/is/correct');
      });
    });

    it('should create a proper path using createHref()', () => {
      const routes = [
        '/the/wrong/path',
        '/some/really/really/deeply/nested/route/that/is/correct',
        '/some/really/really/deeply/nested/incorrect/route',
      ];

      const router = makeRouterDriver({ initialEntries: routes })(never())
        .path('/some').path('/really').path('/really').path('/deeply')
        .path('/nested').path('/route').path('/that');

      router.history().observe(({ pathname }) => {
        assert.strictEqual(pathname,
          '/some/really/really/deeply/nested/route/that/is/correct');
        assert.strictEqual(
          router.createHref('/is/correct'),
          '/some/really/really/deeply/nested/route/that/is/correct');
      });
    });
  });

  describe('define()', () => {
    it('should match routes against a definition object', done => {
      const defintion = {
        '/some': {
          '/route': 123,
        },
      };

      const routes = [
        '/some/route',
      ];

      const router = makeRouterDriver({ initialEntries: routes })(never());
      const match$ = router.define(defintion);

      match$.observe(({path, value, location}) => {
        assert.strictEqual(path, '/some/route');
        assert.strictEqual(value, 123);
        assert.strictEqual(location.pathname, '/some/route');
        done();
      });
    });

    it('should respect prior filtering by path()', done => {
      const defintion = {
        '/correct': {
          '/route': 123,
        },
      };

      const routes = [
        '/wrong/path',
        '/some/nested/correct/route',
      ];

      const router = makeRouterDriver()(from(routes));
      const match$ = router.path('/some').path('/nested').define(defintion);

      match$.observe(({path, value, location}) => {
        assert.strictEqual(path, '/correct/route');
        assert.strictEqual(value, 123);
        assert.strictEqual(location.pathname, '/some/nested/correct/route');
        done();
      });
    });

    it('should match a default route if one is not found', done => {
      const definition = {
        '/correct': {
          '/route': 123,
        },
        '*': 999,
      };

      const routes = [
        '/wrong/path',
        '/wrong/route',
        '/some/nested/incorrect/route',
      ];

      const router = makeRouterDriver()(from(routes));
      const match$ = router.path('/some').path('/nested').define(definition);

      match$.observe(({path, value, location}) => {
        assert.strictEqual(path, '/incorrect/route');
        assert.strictEqual(value, 999);
        assert.strictEqual(location.pathname, '/some/nested/incorrect/route');
        done();
      });
    });

    it('should create a proper href using createHref()', done => {
      const defintion = {
        '/correct': {
          '/route': 123,
        },
        '*': 999,
      };

      const routes = [
        '/wrong/path',
        '/some/nested/correct/route',
      ];

      const router = makeRouterDriver()(from(routes));
      const match$ = router
        .path('/some').path('/nested').define(defintion);

      match$.observe(({location: {pathname}, createHref}) => {
        assert.strictEqual(pathname, '/some/nested/correct/route');
        assert.strictEqual(createHref('/correct/route'), pathname);
        done();
      });
    });

    it('should match partials', done => {
      const defintion = {
        '/correct': {
          '/route': 123,
        },
        '*': 999,
      };

      const routes = [
        '/wrong/path',
        '/some/nested/correct/route/partial',
      ];

      const router = makeRouterDriver()(from(routes));
      const match$ = router
        .path('/some').path('/nested').define(defintion);

      match$.observe(({path, location: {pathname}}) => {
        assert.strictEqual(path, '/correct/route');
        assert.strictEqual(pathname, '/some/nested/correct/route/partial');
        done();
      });
    });
  });
});

describe('Router', () => {
  it('should match Components', () => {
    const definitions = {
      '/home': () => ({ router: of('/') }),
      '/other': () => ({ router: of('/home') }),
      '/some': {
        '/:id': (id: number) => () => ({ router: of('/other/' + id) }),
      },
    };

    const routes = [
      '/wrong/path',
      '/some/32',
    ];

    const router = makeRouterDriver()(from(routes));

    const sinks$ = Router(definitions)({ router });

    const router$ = sinks$.map(sinks => sinks.router).switch();

    return router$.observe((route: HistoryInput | string) => {
      assert.strictEqual(route, '/some/32/other/32');
    });
  });

  it('should match nested Routers', () => {
    const definitions = {
      '/home': Router({
        '/': () => ({ router: of('/hello') }),
      }),
      '/other': () => ({ router: of('/home') }),
      '/some': {
        '/:id': (id: number) => () => ({ router: of('/other/' + id) }),
      },
    };

    const routes = [
      '/wrong/path',
      '/home/',
    ];

    const router = makeRouterDriver()(from(routes));

    const sinks$ = Router(definitions)({ router });

    const router$ = sinks$.map(sinks => sinks.router).switch();

    return router$.observe((route: HistoryInput | string) => {
      assert.strictEqual(route, '/home/hello');
    });
  });
});

function from(routes: Array<string>): Stream<string> {
  return periodic(10, 1)
    .skip(1)
    .take(routes.length - 1)
    .scan((x, y) => x + y, 0)
    .map(x => routes[x]);
}
