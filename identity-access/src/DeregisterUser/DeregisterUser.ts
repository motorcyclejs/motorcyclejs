import { Stream, combineArray, map, fromPromise, switchLatest } from 'most';
import { User, UserRepository } from '../types';

export interface DeregisterUserSinks {
  userRepository$: Stream<UserRepository>;
  user$: Stream<User>;
}

export function DeregisterUser(sinks: DeregisterUserSinks) {
  const { userRepository$, user$ } = sinks;

  const unregisteredPromise$: Stream<Promise<boolean>> =
    combineArray(deregisterUser, [
      userRepository$,
      user$,
    ]);

  const unregistered$: Stream<boolean> =
    switchLatest(map<Promise<boolean>, Stream<boolean>>(fromPromise, unregisteredPromise$));

  return { unregistered$ };
}

function deregisterUser(
  userRepository: UserRepository,
  user: User): Promise<boolean>
{
  return userRepository.deregisterUser(user);
}
