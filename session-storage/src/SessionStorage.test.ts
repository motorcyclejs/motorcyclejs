/* tslint:disable:max-file-line-count */
import * as assert from 'assert';

import {
  SessionStorage,
  SessionStorageClearCommand,
  SessionStorageCommand,
  SessionStorageRemoveItemCommand,
  SessionStorageSetItemCommand,
  SessionStorageSinks,
  SessionStorageSources,
  clear,
  removeItem,
  setItem,
} from './';
import { async, sync } from 'most-subject';
import { just, never } from 'most';

describe(`SessionStorage`, () => {
  describe(`given SessionStorageSinks`, () => {
    it(`returns SessionStorageSources`, () => {
      const sinks: SessionStorageSinks =
        {
          sessionStorage$: just(clear()),
        };

      const sources: SessionStorageSources = SessionStorage(sinks);

      const { sessionStorage } = sources;

      assert.strictEqual(typeof sessionStorage.getItem, 'function');
    });
  });

  describe(`clear`, () => {
    describe(`when called`, () => {
      it(`returns a SessionStorageClearCommand`, () => {
        const clearCommand: SessionStorageClearCommand = clear();

        assert.strictEqual(clearCommand.method, 'clear');
      });
    });

    describe(`when passed to SessionStorage component`, () => {
      before(() => {
        window.sessionStorage.setItem('a', '1');
        window.sessionStorage.setItem('b', '2');
      });

      it(`clears sessionStorage keys and values`, () => {
        const sessionStorage$ = sync<SessionStorageCommand>();

        SessionStorage({ sessionStorage$ });

        sessionStorage$.next(clear());

        assert.strictEqual(window.sessionStorage.length, 0);
      });
    });
  });

  describe(`removeItem`, () => {
    describe(`when given a string representing a key`, () => {
      it(`returns a SessionRemoveItemCommand containing given key`, () => {
        const sinks: SessionStorageSinks =
          {
            sessionStorage$: never(),
          };

        SessionStorage(sinks);

        const command: SessionStorageRemoveItemCommand = removeItem('a');

        assert.strictEqual(command.method, 'removeItem');
        assert.strictEqual(command.key, 'a');

        const command2: SessionStorageRemoveItemCommand = removeItem('b');

        assert.strictEqual(command2.method, 'removeItem');
        assert.strictEqual(command2.key, 'b');
      });
    });

    describe(`when passed to SessionStorage component`, () => {
      before(() => {
        window.sessionStorage.setItem('a', '1');
        window.sessionStorage.setItem('b', '2');
      });

      after(() => {
        window.sessionStorage.clear();
      });

      it(`removes given key:value from sessionStorage`, () => {
        const sessionStorage$ = sync<SessionStorageCommand>();

        const sinks: SessionStorageSinks =
          {
            sessionStorage$,
          };

        SessionStorage(sinks);

        sessionStorage$.next(removeItem(`a`));

        assert.strictEqual(window.sessionStorage.length, 1);
        assert.strictEqual(window.sessionStorage.getItem('a'), null);
      });
    });
  });

  describe('setItem', () => {
    describe(`when given a string representing a key and a string representing value`, () => {
      it(`returns a SessionStorageSetItemCommand`, () => {
        const sinks: SessionStorageSinks =
          {
            sessionStorage$: never(),
          };

        SessionStorage(sinks);

        const command: SessionStorageSetItemCommand = setItem('a', '1');

        assert.strictEqual(command.method, 'setItem');
        assert.strictEqual(command.key, 'a');
        assert.strictEqual(command.value, '1');

        const command2: SessionStorageSetItemCommand = setItem('b', '2');

        assert.strictEqual(command2.method, 'setItem');
        assert.strictEqual(command2.key, 'b');
        assert.strictEqual(command2.value, '2');
      });
    });

    describe(`when passed to SessionStorage component`, () => {
      before(() => {
        window.sessionStorage.clear();
      });

      after(() => {
        window.sessionStorage.clear();
      });

      it(`adds given key:value to sessionStorage`, () => {
        const sessionStorage$ = sync<SessionStorageCommand>();

        const sinks: SessionStorageSinks =
          {
            sessionStorage$,
          };

        SessionStorage(sinks);

        sessionStorage$.next(setItem(`a`, `1`));

        assert.strictEqual(window.sessionStorage.length, 1);
        assert.strictEqual(window.sessionStorage.getItem(`a`), `1`);
      });
    });
  });

  describe(`SessionStorageSource`, () => {
    describe(`getItem`, () => {
      describe(`given a string representing a key`, () => {
        beforeEach(() => {
          window.sessionStorage.clear();
        });

        it(`returns a stream of corresponding values`, () => {
          const sessionStorage$ = async<SessionStorageCommand>();

          const sinks: SessionStorageSinks =
            {
              sessionStorage$,
            };

          const sources: SessionStorageSources = SessionStorage(sinks);

          const { sessionStorage } = sources;

          const promise = sessionStorage
            .getItem(`a`)
            .take(2)
            .reduce((a: Array<string>, b: string) => a.concat(b), []);

          sessionStorage$.next(setItem('a', '1'));

          return promise.then((values: Array<string>) => {
            assert.deepEqual(values, [null, `1`]);
          });
        });

        it(`returns a stream of updated values`, (done) => {
          const sessionStorage$ = async<SessionStorageCommand>();

          const sinks: SessionStorageSinks =
            {
              sessionStorage$,
            };

          const sources: SessionStorageSources = SessionStorage(sinks);

          const { sessionStorage } = sources;

          const a$ = sessionStorage
            .getItem(`a`)
            .take(4);

          const expected = [null, `1`, `2`, `3`];

          a$.observe(value => {
            assert.strictEqual(value, expected.shift());

            if (expected.length === 0)
              done();
          });

          sessionStorage$.next(setItem(`a`, `1`));
          sessionStorage$.next(setItem(`a`, `2`));
          sessionStorage$.next(setItem(`a`, `3`));
        });
      });
    });

    describe('length', () => {
      describe(`when called`, () => {
        beforeEach(() => {
          window.sessionStorage.clear();
        });

        it(`returns a stream of sessionStorage length`, () => {
          const sessionStorage$ = async<SessionStorageCommand>();

          const sinks: SessionStorageSinks =
            {
              sessionStorage$,
            };

          const sources: SessionStorageSources = SessionStorage(sinks);

          const { sessionStorage } = sources;

          const promise = sessionStorage
            .length()
            .take(4)
            .reduce((a: Array<number>, b: number) => a.concat(b), []);

          sessionStorage$.next(setItem('a', '1'));
          sessionStorage$.next(setItem(`b`, `2`));
          sessionStorage$.next(removeItem(`a`));

          return promise.then((values: Array<number>) => {
            assert.deepEqual(values, [0, 1, 2, 1]);
          });
        });
      });
    });
  });
});
