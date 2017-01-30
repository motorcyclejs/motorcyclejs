import { User, UserCredentials, UserRepository } from '../types';

import { Stream } from 'most';
import { makeSourceStream } from '../makeSourceStream';

export interface SignInUserSinks {
  userRepository$: Stream<UserRepository>;
  userCredentials$: Stream<UserCredentials>;
}

export interface SignInUserSources {
  user$: Stream<User>;
}

export function SignInUser(sinks: SignInUserSinks): SignInUserSources {
  const { userRepository$, userCredentials$ } = sinks;

  const user$ = makeSourceStream(signInUser, userRepository$, userCredentials$);

  return { user$ };
}

function signInUser(
  userRepository: UserRepository,
  userCredentials: UserCredentials): Promise<User>
{
  return userRepository.signInUser(userCredentials);
}
