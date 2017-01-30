import { Stream, combineArray, fromPromise, map, switchLatest } from 'most';
import { User, UserRepository } from '../types';

export interface DeregisterUserSinks {
  userRepository$: Stream<UserRepository>;
  user$: Stream<User>;
}

export interface DeregisterUserSources {
  unregistered$: Stream<boolean>;
}

export function DeregisterUser(sinks: DeregisterUserSinks): DeregisterUserSources {
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
