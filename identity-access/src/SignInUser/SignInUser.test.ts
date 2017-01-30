import * as assert from 'assert';

import { SignInUser, SignInUserSinks, SignInUserSources } from './';
import { concat, delay, just } from 'most';

import { MockUserRepository } from '../MockUserRepository';
import { UserCredentials } from '../types';

describe(`SignInUser`, () => {
  describe(`given SignInUserSinks with valid user credentials`, () => {
    it(`returns SignInUserSources with user stream of existing user`, (done) => {
      const userDb = new Map<string, UserCredentials>();

      const userRepository = new MockUserRepository(userDb);

      const userCredentials: UserCredentials =
        {
          username: 'John',
          password: 'Secret',
        };

      const alternateUserCredentials: UserCredentials =
        {
          username: 'Jane',
          password: 'Password',
        };

      userDb.set('1', userCredentials);
      userDb.set('2', alternateUserCredentials);

      const sinks: SignInUserSinks =
        {
          userRepository$: just(userRepository),
          userCredentials$: concat(
            just(userCredentials),
            delay(1, just(alternateUserCredentials)),
          ),
        };

      const sources: SignInUserSources = SignInUser(sinks);

      const expected = [
        userCredentials.username,
        alternateUserCredentials.username,
      ];

      sources.user$.observe((user) => {
        assert.strictEqual(user.username, expected.shift());

        if (!expected.length)
          done();
      });
    });
  });

  describe(`given SignInUserSinks with invalid user credentials`, () => {
    it(`returns SignInUserSources with user stream error`, (done) => {
      const userDb = new Map<string, UserCredentials>();

      const userRepository = new MockUserRepository(userDb);

      const userCredentials: UserCredentials =
        {
          username: 'John',
          password: 'Secret',
        };

      const alternateUserCredentials: UserCredentials =
        {
          username: 'Jane',
          password: 'Password',
        };

      userDb.set('1', userCredentials);
      userDb.set('2', alternateUserCredentials);

      const sinks: SignInUserSinks =
        {
          userRepository$: just(userRepository),
          userCredentials$: just({username: `invalid`, password: `invalid`}),
        };

      const sources: SignInUserSources = SignInUser(sinks);

      sources.user$.drain()
        .then(() => done(new Error(`User shouldn’t sign in.`)))
        .catch(() => done());
    });
  });
});
