# @motorcycle/local-storage

> Components and functions for interacting with LocalStorage

## Let me have it
```sh
yarn add @motorcycle/local-storage
# or
npm install --save @motorcycle/local-storage
```

## Basic usage
```typescript
import { run } from '@motorcycle/run';
import { makeDomDriver } from '@motorcycle/dom';
import { setItem, LocalStorage } from '@motorcycle/local-storage';
import { map, merge } from 'most';

function Main(sources) {
  const { localStorage } = sources;

  const aItem$ = localStorage.getItem('a') // returns a stream of values associated with `a`

  ... // left as an user exercise

  // a stream of commands to set the values to the given keys `a` and `b`
  const setAItem$ = map(setItem('a'), streamOfAValues);
  const setBItem$ = map(setItem('b'), streamOfBValue);

  return {
    dom, // left as an user exercise
    localStorage$: merge(setAItem$, setBItem$)
  }
}

const domDriver = makeDomDriver(document.querySelector('#app') as HTMLElement);

function Effects(sinks) {
  const { localStorage } = LocalStorage(sinks);
  const dom = domDriver(sinks.dom);

  return { dom, localStorage };
}

run(Main, Effects);
```

## API

### `LocalStorage(sinks: LocalStorageSinks): LocalStorageSources;`

An Effect component for interacting with `localStorage`.

```typescript
import { LocalStorage } from '@motorcycle/local-storage';

function Effects(sinks) {
  const { localStorage } = LocalStorage(sinks);

  return { localStorage };
}

run(Main, Effects);
```

### `clear(): LocalStorageClearCommand;`

Remove all items from LocalStorage

```typescript
import { clear } from '@motorcycle/local-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const clear$ = constant(clear(), clearButtonClick$);

  return {
    ...,
    localStorage$: clear$,
  }
}
```

### `removeItem(key: string): LocalStorageRemoveItemCommand`

Remove a single item by its associated `key` from LocalStorage

```typescript
import { removeItem } from '@motorcycle/local-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const removeItem$ = map(removeItem, itemToRemove$);

  return {
    ...,
    localStorage$: removeItem$,
  }
}
```

### `setItem(key: string, value: string): LocalStorageSetItemCommand`

Set a single item `value` that can be looked up by the given `key`

```typescript
import { setItem } from '@motorcycle/local-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const setItem$ = map(([key, value]) => setItem(key, value), keyValue$);

  return {
    ...,
    localStorage$: setItem$,
  }
}
```

## Types

The types used throughout the API section

```typescript
export interface LocalStorageSinks {
  localStorage$: Stream<LocalStorageCommand>;
}

export interface LocalStorageSources {
  localStorage: LocalStorageSource;
}

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
```