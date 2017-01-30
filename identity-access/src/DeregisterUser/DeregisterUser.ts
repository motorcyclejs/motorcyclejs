import { User, UserRepository } from '../types';

import { Stream } from 'most';
import { makeSourceStream } from '../makeSourceStream';

export interface DeregisterUserSinks {
  userRepository$: Stream<UserRepository>;
  user$: Stream<User>;
}

export interface DeregisterUserSources {
  unregistered$: Stream<boolean>;
}

export function DeregisterUser(sinks: DeregisterUserSinks): DeregisterUserSources {
  const { userRepository$, user$ } = sinks;

  const unregistered$ = makeSourceStream(deregisterUser, userRepository$, user$);

  return { unregistered$ };
}

function deregisterUser(
  userRepository: UserRepository,
  user: User): Promise<boolean>
{
  return userRepository.deregisterUser(user);
}
