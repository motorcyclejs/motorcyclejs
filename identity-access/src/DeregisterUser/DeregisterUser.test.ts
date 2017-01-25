import * as assert from 'assert';
import { just } from 'most';
import { isStream } from '@typed/is-stream';
import { DeregisterUser, DeregisterUserSinks } from './DeregisterUser';
import { MockUserRepostiory } from '../MockUserRepository';
import { User } from '../types';

describe('DeregisterUser', () => {
  describe('given DeregisterUserSinks as input', () => {
    it('returns an object containing a stream at key `unregistered$`', () => {
      const users = new Map();

      const userRepository = new MockUserRepostiory(users);

      const user: User =
        {
          id: '1',
          username: 'John',
        };

      const sinks: DeregisterUserSinks =
        {
          userRepository$: just(userRepository),
          user$: just(user),
        };

      const sources = DeregisterUser(sinks);

      assert.ok(sources.hasOwnProperty('unregistered$'));
      assert.ok(isStream(sources.unregistered$));
    });

    describe(`unregistered$`, () => {
      describe(`given a registered user`, () => {
        it(`returns true`, () => {
          const user: User =
            {
              id: '1',
              username: 'John',
            };

          const users = new Map([
            [user.id, user],
          ]);

          const userRepository = new MockUserRepostiory(users);

          const sinks: DeregisterUserSinks =
            {
              userRepository$: just(userRepository),
              user$: just(user),
            };

          const { unregistered$ } = DeregisterUser(sinks);

          return unregistered$.observe(assert.ok);
        });
      });

      describe(`given an unregistered user`, () => {
        it(`returns false`, () => {
          const user: User =
            {
              id: '1',
              username: 'John',
            };

          const users = new Map();

          const userRepository = new MockUserRepostiory(users);

          const sinks: DeregisterUserSinks =
            {
              userRepository$: just(userRepository),
              user$: just(user),
            };

          const { unregistered$ } = DeregisterUser(sinks);

          return unregistered$.observe((isUnregistered: boolean) => {
            assert.ok(!isUnregistered);
          });
        });
      });
    });
  });
});
