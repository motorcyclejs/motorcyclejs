import { CurriedFunction2, curry2 } from '@most/prelude';
import {
  SessionStorageClearCommand,
  SessionStorageCommand,
  SessionStorageRemoveItemCommand,
  SessionStorageSetItemCommand,
  SessionStorageSource,
} from './types';
import {
  Stream,
  constant,
  drain,
  map,
  multicast,
  skipRepeats,
  startWith,
  tap,
} from 'most';

import { hold } from '@most/hold';

export interface SessionStorageSinks {
  sessionStorage$: Stream<SessionStorageCommand>;
}

export interface SessionStorageSources {
  sessionStorage: SessionStorageSource;
}

export function SessionStorage(sinks: SessionStorageSinks): SessionStorageSources {
  const { sessionStorage$ } = sinks;

  const storage$: Stream<Storage> =
    multicast(constant(window.sessionStorage, tap(storageAction, sessionStorage$)));

  drain(storage$);

  const getItem = createGetItem(storage$);
  const length = createLength(storage$);

  const sessionStorage: SessionStorageSource =
    {
      getItem,
      length,
    };

  return { sessionStorage };
}

export function clear(): SessionStorageClearCommand {
  return { method: 'clear' };
}

export function removeItem(key: string): SessionStorageRemoveItemCommand {
  return { method: 'removeItem', key };
}

export const setItem: CurriedFunction2<string, string, SessionStorageSetItemCommand> = curry2(
  function setItem(key: string, value: string): SessionStorageSetItemCommand {
    return { method: 'setItem', key, value };
  },
);

function storageAction(command: SessionStorageCommand) {
  if (command.method === 'clear')
    window.sessionStorage.clear();

  if (command.method === 'removeItem')
    window.sessionStorage.removeItem(command.key);

  if (command.method === 'setItem')
    window.sessionStorage.setItem(command.key, command.value);
}

function createGetItem(storage$: Stream<Storage>) {
  return function getItem(key: string): Stream<string | null> {
    return hold(skipRepeats(
      map(storage => storage.getItem(key), startWith(window.sessionStorage, storage$))));
  };
}

function createLength(storage$: Stream<Storage>) {
  return function length(): Stream<number> {
    return hold(skipRepeats(
      map(storage => storage.length, startWith(window.sessionStorage, storage$))));
  };
}
