import { CurriedFunction2, curry2 } from '@most/prelude';
import {
  LocalStorageClearCommand,
  LocalStorageCommand,
  LocalStorageRemoveItemCommand,
  LocalStorageSetItemCommand,
  LocalStorageSource,
} from './types';
import {
  Stream,
  constant,
  drain,
  filter,
  fromEvent,
  map,
  merge,
  multicast,
  skipRepeats,
  startWith,
  tap,
} from 'most';

import { hold } from '@most/hold';

export interface LocalStorageSinks {
  localStorage$: Stream<LocalStorageCommand>;
}

export interface LocalStorageSources {
  localStorage: LocalStorageSource;
}

export function LocalStorage(sinks: LocalStorageSinks): LocalStorageSources {
  const { localStorage$ } = sinks;

  const localStorageEvent$: Stream<StorageEvent> =
    filter(isLocalStorageEvent, fromEvent<StorageEvent>('storage', window, true));

  const storage$: Stream<Storage> =
    multicast(merge(
      constant(window.localStorage, tap(storageAction, localStorage$)),
      constant(window.localStorage, localStorageEvent$),
    ));

  drain(storage$);

  const getItem = createGetItem(storage$);
  const length = createLength(storage$);

  const localStorage: LocalStorageSource =
    {
      getItem,
      length,
    };

  return { localStorage };
}

export function clear(): LocalStorageClearCommand {
  return { method: 'clear' };
}

export function removeItem(key: string): LocalStorageRemoveItemCommand {
  return { method: 'removeItem', key };
}

export const setItem: CurriedFunction2<string, string, LocalStorageSetItemCommand> = curry2(
  function setItem(key: string, value: string): LocalStorageSetItemCommand {
    return { method: 'setItem', key, value };
  },
);

function storageAction(command: LocalStorageCommand) {
  if (command.method === 'clear')
    window.localStorage.clear();

  if (command.method === 'removeItem')
    window.localStorage.removeItem(command.key);

  if (command.method === 'setItem')
    window.localStorage.setItem(command.key, command.value);
}

function createGetItem(storage$: Stream<Storage>) {
  return function getItem(key: string): Stream<string | null> {
    return hold(skipRepeats(
      map(storage => storage.getItem(key), startWith(window.localStorage, storage$))));
  };
}

function createLength(storage$: Stream<Storage>) {
  return function length(): Stream<number> {
    return hold(skipRepeats(
      map(storage => storage.length, startWith(window.localStorage, storage$))));
  };
}

function isLocalStorageEvent(event: StorageEvent): boolean {
  return event.storageArea === window.localStorage;
}
