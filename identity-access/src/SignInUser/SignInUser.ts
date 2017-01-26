import { Stream, combineArray, fromPromise, map, switchLatest } from 'most';
import { User, UserCredentials, UserRepository } from '../types';

export interface SignInUserSinks {
  userRepository$: Stream<UserRepository>;
  userCredentials$: Stream<UserCredentials>;
}

export interface SignInUserSources {
  user$: Stream<User>;
}

export function SignInUser(sinks: SignInUserSinks): SignInUserSources {
  const { userRepository$, userCredentials$ } = sinks;

  const userPromise$: Stream<Promise<User>> =
    combineArray(signInUser, [
      userRepository$,
      userCredentials$,
    ]);

  const user$: Stream<User> =
    switchLatest(map<Promise<User>, Stream<User>>(fromPromise, userPromise$));

  return { user$ };
}

function signInUser(
  userRepository: UserRepository,
  userCredentials: UserCredentials): Promise<User>
{
  return userRepository.signInUser(userCredentials);
}
