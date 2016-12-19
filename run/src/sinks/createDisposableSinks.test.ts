import { periodic } from 'most';
import { sync } from 'most-subject';
import { createDisposableSinks } from './createDisposableSinks';

describe('createDisposableSinks', () => {
  describe('given Sinks and a subject', () => {
    it('disposes Sinks when subject emits', (done) => {
      const sinks = {
        test: periodic(100),
      };

      const subject = sync<void>();

      const disposableSinks = createDisposableSinks(sinks, subject);

      disposableSinks.test.drain().then(() => done()).catch(done);

      subject.next(void 0);
    });
  });
});
