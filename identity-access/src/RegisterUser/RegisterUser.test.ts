import * as assert from 'assert';
import { just, combineArray } from 'most';
import {
  RegisterUser,
  RegisterUserSinks,
  RegisterUserSources,
} from './RegisterUser';

import { User, UserCredentials } from '../types';
import { MockUserRepostiory } from '../MockUserRepository';

describe('RegisterUser', () => {
  describe('given RegisterUserSinks', () => {
    it('returns RegisterUserSources', () => {
      const users = new Map();

      const userRepository = new MockUserRepostiory(users);
      const alternateUserRepository = new MockUserRepostiory(users);

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

      const registerUserSinks: RegisterUserSinks =
        {
          userRepository$: just(userRepository),
          userCredentials$: just(userCredentials),
        };

      const alternateRegisterUserSinks: RegisterUserSinks =
        {
          userRepository$: just(alternateUserRepository),
          userCredentials$: just(alternateUserCredentials),
        };

      const sources: RegisterUserSources =
        RegisterUser(registerUserSinks);

      const alternateSources: RegisterUserSources =
        RegisterUser(alternateRegisterUserSinks);

      return combineArray((user: User, alternateUser: User) => {
        assert.strictEqual(user.id, '1');
        assert.strictEqual(user.username, 'John');
        assert.strictEqual(alternateUser.id, '2');
        assert.strictEqual(alternateUser.username, 'Jane');
      }, [
        sources.user$,
        alternateSources.user$,
      ]);
    });
  });
});
