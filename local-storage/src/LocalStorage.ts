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
  startWith,
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
    merge(
      hold(map(storageAction, localStorage$)),
      hold(constant(window.localStorage, localStorageEvent$)),
    );

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

function storageAction(command: LocalStorageCommand): Storage {
  if (command.method === 'clear')
    window.localStorage.clear();

  if (command.method === 'removeItem')
    window.localStorage.removeItem(command.key);

  if (command.method === 'setItem')
    window.localStorage.setItem(command.key, command.value);

  return window.localStorage;
}

function createGetItem(storage$: Stream<Storage>) {
  return function getItem(key: string): Stream<string | null> {
    return map(storage => storage.getItem(key), startWith(window.localStorage, storage$));
  };
}

function createLength(storage$: Stream<Storage>) {
  return function length(): Stream<number> {
    return map(storage => storage.length, startWith(window.localStorage, storage$));
  };
}

function isLocalStorageEvent(event: StorageEvent): boolean {
  return event.storageArea === window.localStorage;
}
