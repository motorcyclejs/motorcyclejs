import { Stream } from 'most';

export interface LocalStorageSource {
  getItem(key: string): Stream<string | null>;
  length(): Stream<number>;
}

export type LocalStorageCommand =
  LocalStorageClearCommand |
  LocalStorageSetItemCommand |
  LocalStorageRemoveItemCommand;

export type LocalStorageClearCommand =
  {
    method: 'clear';
  };

export type LocalStorageSetItemCommand =
  {
    method: 'setItem';
    key: string;
    value: string;
  };

export type LocalStorageRemoveItemCommand =
  {
    method: 'removeItem';
    key: string;
  };
