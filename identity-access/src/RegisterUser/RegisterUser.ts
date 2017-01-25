import { Stream, combineArray, fromPromise, map, switchLatest } from 'most';
import { UserRepository, User, UserCredentials } from '../types';

export interface RegisterUserSinks {
  userRepository$: Stream<UserRepository>;
  userCredentials$: Stream<UserCredentials>;
}

export interface RegisterUserSources {
  user$: Stream<User>;
}

export function RegisterUser(sinks: RegisterUserSinks): RegisterUserSources {
  const { userRepository$, userCredentials$ } = sinks;

  const userPromise$: Stream<Promise<User>> =
    combineArray(registerUser, [
      userRepository$,
      userCredentials$,
    ]);

  const user$: Stream<User> =
    switchLatest(map<Promise<User>, Stream<User>>(fromPromise, userPromise$));

  return { user$ };
}

function registerUser (
  userRepository: UserRepository,
  userCredentials: UserCredentials): Promise<User>
{
  return userRepository.registerUser(userCredentials);
}
