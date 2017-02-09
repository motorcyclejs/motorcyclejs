/* tslint:disable:max-file-line-count */
import * as assert from 'assert';

import {
  LocalStorage,
  LocalStorageClearCommand,
  LocalStorageCommand,
  LocalStorageRemoveItemCommand,
  LocalStorageSetItemCommand,
  LocalStorageSinks,
  LocalStorageSources,
  clear,
  removeItem,
  setItem,
} from './';
import { async, sync } from 'most-subject';
import { just, never } from 'most';

describe(`LocalStorage`, () => {
  describe(`given LocalStorageSinks`, () => {
    it(`returns LocalStorageSources`, () => {
      const sinks: LocalStorageSinks =
        {
          localStorage$: just(clear()),
        };

      const sources: LocalStorageSources = LocalStorage(sinks);

      const { localStorage } = sources;

      assert.strictEqual(typeof localStorage.getItem, 'function');
    });
  });

  describe(`clear`, () => {
    describe(`when called`, () => {
      it(`returns a LocalStorageClearCommand`, () => {
        const clearCommand: LocalStorageClearCommand = clear();

        assert.strictEqual(clearCommand.method, 'clear');
      });
    });

    describe(`when passed to LocalStorage component`, () => {
      before(() => {
        window.localStorage.setItem('a', '1');
        window.localStorage.setItem('b', '2');
      });

      it(`clears localStorage keys and values`, () => {
        const localStorage$ = sync<LocalStorageCommand>();

        LocalStorage({ localStorage$ });

        localStorage$.next(clear());

        assert.strictEqual(window.localStorage.length, 0);
      });
    });
  });

  describe(`removeItem`, () => {
    describe(`when given a string representing a key`, () => {
      it(`returns a LocalRemoveItemCommand containing given key`, () => {
        const sinks: LocalStorageSinks =
          {
            localStorage$: never(),
          };

        LocalStorage(sinks);

        const command: LocalStorageRemoveItemCommand = removeItem('a');

        assert.strictEqual(command.method, 'removeItem');
        assert.strictEqual(command.key, 'a');

        const command2: LocalStorageRemoveItemCommand = removeItem('b');

        assert.strictEqual(command2.method, 'removeItem');
        assert.strictEqual(command2.key, 'b');
      });
    });

    describe(`when passed to LocalStorage component`, () => {
      before(() => {
        window.localStorage.setItem('a', '1');
        window.localStorage.setItem('b', '2');
      });

      after(() => {
        window.localStorage.clear();
      });

      it(`removes given key:value from localStorage`, () => {
        const localStorage$ = sync<LocalStorageCommand>();

        const sinks: LocalStorageSinks =
          {
            localStorage$,
          };

        LocalStorage(sinks);

        localStorage$.next(removeItem(`a`));

        assert.strictEqual(window.localStorage.length, 1);
        assert.strictEqual(window.localStorage.getItem('a'), null);
      });
    });
  });

  describe('setItem', () => {
    describe(`when given a string representing a key and a string representing value`, () => {
      it(`returns a LocalStorageSetItemCommand`, () => {
        const sinks: LocalStorageSinks =
          {
            localStorage$: never(),
          };

        LocalStorage(sinks);

        const command: LocalStorageSetItemCommand = setItem('a', '1');

        assert.strictEqual(command.method, 'setItem');
        assert.strictEqual(command.key, 'a');
        assert.strictEqual(command.value, '1');

        const command2: LocalStorageSetItemCommand = setItem('b', '2');

        assert.strictEqual(command2.method, 'setItem');
        assert.strictEqual(command2.key, 'b');
        assert.strictEqual(command2.value, '2');
      });
    });

    describe(`when passed to LocalStorage component`, () => {
      before(() => {
        window.localStorage.clear();
      });

      after(() => {
        window.localStorage.clear();
      });

      it(`adds given key:value to localStorage`, () => {
        const localStorage$ = sync<LocalStorageCommand>();

        const sinks: LocalStorageSinks =
          {
            localStorage$,
          };

        LocalStorage(sinks);

        localStorage$.next(setItem(`a`, `1`));

        assert.strictEqual(window.localStorage.length, 1);
        assert.strictEqual(window.localStorage.getItem(`a`), `1`);
      });
    });
  });

  describe(`LocalStorageSource`, () => {
    describe(`getItem`, () => {
      describe(`given a string representing a key`, () => {
        beforeEach(() => {
          window.localStorage.clear();
        });

        it(`returns a stream of corresponding values`, () => {
          const localStorage$ = async<LocalStorageCommand>();

          const sinks: LocalStorageSinks =
            {
              localStorage$,
            };

          const sources: LocalStorageSources = LocalStorage(sinks);

          const { localStorage } = sources;

          const promise = localStorage
            .getItem(`a`)
            .take(2)
            .reduce((a: Array<string>, b: string) => a.concat(b), []);

          localStorage$.next(setItem('a', '1'));

          return promise.then((values: Array<string>) => {
            assert.deepEqual(values, [null, `1`]);
          });
        });

        it(`returns a stream of updated values`, (done) => {
          const localStorage$ = async<LocalStorageCommand>();

          const sinks: LocalStorageSinks =
            {
              localStorage$,
            };

          const sources: LocalStorageSources = LocalStorage(sinks);

          const { localStorage } = sources;

          const a$ = localStorage
            .getItem(`a`)
            .take(4);

          const expected = [null, `1`, `2`, `3`];

          a$.observe(value => {
            assert.strictEqual(value, expected.shift());

            if (expected.length === 0)
              done();
          });

          localStorage$.next(setItem(`a`, `1`));
          localStorage$.next(setItem(`a`, `2`));
          localStorage$.next(setItem(`a`, `3`));
        });

        it(`returns a stream of updated values from other windows`, (done) => {
          const otherWindow = window.open();

          const sinks: LocalStorageSinks =
            {
              localStorage$: never(),
            };

          const sources: LocalStorageSources = LocalStorage(sinks);

          const { localStorage } = sources;

          const a$ = localStorage
            .getItem(`a`)
            .take(4);

          const expected = [null, `1`, `2`, `3`];

          a$.observe(value => {
            assert.strictEqual(value, expected.shift());

            if (expected.length === 0)
              done();
          });

          function setNextValue(value: number) {
            return new Promise((resolve) => {
              otherWindow.localStorage.setItem(`a`, String(value));

              setTimeout(resolve, 10, value + 1);
            });
          }

          Promise.resolve(1)
            .then(setNextValue)
            .then(setNextValue)
            .then(setNextValue);
        });
      });
    });

    describe('length', () => {
      describe(`when called`, () => {
        beforeEach(() => {
          window.localStorage.clear();
        });

        it(`returns a stream of localStorage length`, () => {
          const localStorage$ = async<LocalStorageCommand>();

          const sinks: LocalStorageSinks =
            {
              localStorage$,
            };

          const sources: LocalStorageSources = LocalStorage(sinks);

          const { localStorage } = sources;

          const promise = localStorage
            .length()
            .take(4)
            .reduce((a: Array<number>, b: number) => a.concat(b), []);

          localStorage$.next(setItem('a', '1'));
          localStorage$.next(setItem(`b`, `2`));
          localStorage$.next(removeItem(`a`));

          return promise.then((values: Array<number>) => {
            assert.deepEqual(values, [0, 1, 2, 1]);
          });
        });
      });
    });
  });
});
