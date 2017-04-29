import { Stream } from 'most'

export interface SessionStorageSource {
  getItem(key: string): Stream<string | null>
  length(): Stream<number>
}

export type SessionStorageCommand =
  SessionStorageClearCommand |
  SessionStorageSetItemCommand |
  SessionStorageRemoveItemCommand

export type SessionStorageClearCommand =
  {
    method: 'clear';
  }

export type SessionStorageSetItemCommand =
  {
    method: 'setItem';
    key: string;
    value: string;
  }

export type SessionStorageRemoveItemCommand =
  {
    method: 'removeItem';
    key: string;
  }
