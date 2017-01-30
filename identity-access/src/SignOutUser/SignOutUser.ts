import { User, UserRepository } from '../';

import { Stream } from 'most';
import { makeSourceStream } from '../makeSourceStream';

export interface SignOutUserSinks {
  userRepository$: Stream<UserRepository>;
  user$: Stream<User>;
}

export interface SignOutUserSources {
  signedOut$: Stream<boolean>;
}

export function SignOutUser(sinks: SignOutUserSinks): SignOutUserSources {
  const { userRepository$, user$ } = sinks;

  const signedOut$ = makeSourceStream(signOutUser, userRepository$, user$);

  return { signedOut$ };
}

function signOutUser(
  userRepository: UserRepository,
  user: User): Promise<boolean>
{
  return userRepository.signOutUser(user);
}
