import { Stream, combineArray, fromPromise, map, switchLatest } from 'most';
import { User, UserRepository } from '../';

export interface SignOutUserSinks {
  userRepository$: Stream<UserRepository>;
  user$: Stream<User>;
}

export interface SignOutUserSources {
  signedOut$: Stream<boolean>;
}

export function SignOutUser(sinks: SignOutUserSinks): SignOutUserSources {
  const { userRepository$, user$ } = sinks;

  const signedOutPromise$: Stream<Promise<boolean>> =
    combineArray(signOutUser, [
      userRepository$,
      user$,
    ]);

  const signedOut$: Stream<boolean> =
    switchLatest(map<Promise<boolean>, Stream<boolean>>(fromPromise, signedOutPromise$));

  return { signedOut$ };
}

function signOutUser(
  userRepository: UserRepository,
  user: User): Promise<boolean>
{
  return userRepository.signOutUser(user);
}
