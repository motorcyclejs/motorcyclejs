import * as assert from 'assert';
import * as most from 'most';
import { sync } from 'most-subject';

import * as Motorcycle from '../src';

describe('Motorcycle Core', () => {
  it('has a method `run`', () => {
    assert.strictEqual(typeof Motorcycle.run, 'function');
  });

  describe('run', () => {
    describe('given main function returning object with named keys', () => {
      it('returns an object with property `sinks` with named keys given by main return', () => {
        const test = most.of(1);

        function main() {
          return {
            test,
          };
        }

        const drivers = {};

        const { sinks } = Motorcycle.run(main, () => drivers);

        assert.ok(sinks.hasOwnProperty('test'));
        assert.strictEqual((sinks.test.source as any).source, test.source);
      });

      it('returns an object with property `sources` with named keys reflected from driver keys' +
        'and values reflecting the return value of the driver functions', () => {
          const test = most.of(1);

          function main() {
            return {
              test,
            };
          }

          const return1 = {};

          const drivers = {
            test: return1,
          };

          const { sources } = Motorcycle.run<{ test: any }, any>(main, () => drivers);

          assert.ok(sources.hasOwnProperty('test'));
          assert.strictEqual(sources.test, return1);

          const return2 = {};

          const effects = {
            other: return2,
          };

          const { sources: secondSources } =
            Motorcycle.run<{ other: any }, any>(main, () => effects);

          assert.ok(secondSources.hasOwnProperty('other'));
          assert.strictEqual(secondSources.other, return2);
        });

      it('returns an object with key `dispose` of type function', () => {
        const test = most.of(1);

        function main() {
          return {
            test,
          };
        }

        const drivers = {
          test: () => { return {}; },
        };

        const { dispose } = Motorcycle.run<{ test: any }, any>(main, () => drivers);

        assert.strictEqual(typeof dispose, 'function');
      });
    });

    describe('dispose', () => {
      it('stops sinks from emitting', () => {
        const test = most.periodic(100)
          .scan((x) => x + 1, 0);
        // at time 0 - scan emits seed value 0
        // at time 0 - periodic emits void incrementing value to 1
        // at time 100 - periodic emits void incrementing value to 2
        // at time 200 - ... to 3

        function main() {
          return {
            test,
          };
        }

        const drivers = {};

        const { sinks, dispose } =
          Motorcycle.run<any, { test: most.Stream<number> }>(main, () => drivers);

        const expected = [0, 1, 2, 3];

        setTimeout(() => {
          dispose();
        }, 250);

        return sinks.test.observe(n => {
          assert.strictEqual(n, expected.shift());
        });
      });

      it('stops sinkProxies from emitting', (done) => {
        const test = most.periodic(100)
          .scan((x) => x + 1, 0);
        // at time 0 - scan emits seed value 0
        // at time 0 - periodic emits void incrementing value to 1
        // at time 100 - periodic emits void incrementing value to 2
        // at time 200 - ... to 3

        function main() {
          return {
            test,
          };
        }

        const expected = [0, 1, 2, 3];

        function effects(sinks: any) {
          return {
            test: sinks.test.observe((n: number) => {
              assert.strictEqual(n, expected.shift());
              if (n === 3) {
                setTimeout(() => {
                  done();
                }, 150);
              }
            }),
          };
        }

        const { dispose } =
          Motorcycle.run<any, { test: most.Stream<number> }>(main, effects);

        setTimeout(() => {
          dispose();
        }, 250);
      });

      it('stops Sources with a `dispose` method from emitting', (done) => {
        const test = most.periodic(100)
          .scan((x) => x + 1, 0);
        // at time 0 - scan emits seed value 0
        // at time 0 - periodic emits void incrementing value to 1
        // at time 100 - periodic emits void incrementing value to 2
        // at time 200 - ... to 3

        interface Sources {
          test: {
            foo: most.Stream<number>;
            dispose(): void;
          };
        }

        function main() {
          return {
            test,
          };
        }

        const subject = sync();
        const foo = test.until(subject);

        const drivers = {
          test: {
            foo,
            dispose() {
              subject.next({});
            },
          },
        };

        const { sources, dispose } =
          Motorcycle.run<Sources, any>(main, () => drivers);

        sources.test.foo
          .observe(n => {
            assert.notStrictEqual(n, 4);

            if (n === 3) {
              dispose();
            }
          })
          .then(() => done())
          .catch(done);
      });
    });
  });
});
