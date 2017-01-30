import * as assert from 'assert';

import { SignOutUser, SignOutUserSinks, SignOutUserSources } from './';

import { MockUserRepository } from '../MockUserRepository';
import { User } from '../';
import { isStream } from '@typed/is-stream';
import { just } from 'most';

describe(`SignOutUser`, () => {
  describe(`given SignOutUserSinks`, () => {
    it(`returns SignOutUserSources with signedOut stream`, () => {
      const userDb = new Map();

      const userRepository$ = just(new MockUserRepository(userDb));

      const user$ = just(
        {
          id: `1`,
          username: `John`,
        },
      );

      const sinks: SignOutUserSinks =
        {
          userRepository$,
          user$,
        };

      const sources: SignOutUserSources = SignOutUser(sinks);

      assert.ok(sources.hasOwnProperty(`signedOut$`));
      assert.ok(isStream(sources.signedOut$));
    });

    describe(`signedOut$`, () => {
      describe(`given a registered user`, () => {
        it(`returns true`, () => {
          const user: User =
            {
              id: `1`,
              username: `John`,
            };

          const users = new Map([
            [user.id, { username: user.username, password: `secret` }],
          ]);

          const userRepository = new MockUserRepository(users);

          const sinks: SignOutUserSinks =
            {
              userRepository$: just(userRepository),
              user$: just(user),
            };

          const { signedOut$ } = SignOutUser(sinks);

          return signedOut$.observe(assert.ok);
        });
      });

      describe(`given an unregistered user`, () => {
        it(`returns false`, () => {
          const user: User =
            {
              id: `1`,
              username: `John`,
            };

          const users = new Map();

          const userRepository = new MockUserRepository(users);

          const sinks: SignOutUserSinks =
            {
              userRepository$: just(userRepository),
              user$: just(user),
            };

          const { signedOut$ } = SignOutUser(sinks);

          return signedOut$.observe((isSignedOut: boolean) => {
            assert.ok(!isSignedOut);
          });
        });
      });
    });
  });
});
