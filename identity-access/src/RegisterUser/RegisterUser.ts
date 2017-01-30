import { User, UserCredentials, UserRepository } from '../types';

import { Stream } from 'most';
import { makeSourceStream } from '../makeSourceStream';

export interface RegisterUserSinks {
  userRepository$: Stream<UserRepository>;
  userCredentials$: Stream<UserCredentials>;
}

export interface RegisterUserSources {
  user$: Stream<User>;
}

export function RegisterUser(sinks: RegisterUserSinks): RegisterUserSources {
  const { userRepository$, userCredentials$ } = sinks;

  const user$ = makeSourceStream(registerUser, userRepository$, userCredentials$);

  return { user$ };
}

function registerUser (
  userRepository: UserRepository,
  userCredentials: UserCredentials): Promise<User>
{
  return userRepository.registerUser(userCredentials);
}
