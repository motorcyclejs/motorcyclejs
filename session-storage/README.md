# @motorcycle/session-storage

> Components and functions for interacting with SessionStorage

## Let me have it
```sh
yarn add @motorcycle/session-storage
# or
npm install --save @motorcycle/session-storage
```

## Basic usage
```typescript
import { run } from '@motorcycle/run';
import { makeDomDriver } from '@motorcycle/dom';
import { setItem, SessionStorage } from '@motorcycle/session-storage';
import { map, merge } from 'most';

function Main(sources) {
  const { sessionStorage } = sources;

  const aItem$ = sessionStorage.getItem('a') // returns a stream of values associated with `a`

  ... // left as an user exercise

  // a stream of commands to set the values to the given keys `a` and `b`
  const setAItem$ = map(setItem('a'), streamOfAValues);
  const setBItem$ = map(setItem('b'), streamOfBValue);

  return {
    dom, // left as an user exercise
    sessionStorage$: merge(setAItem$, setBItem$)
  }
}

const domDriver = makeDomDriver(document.querySelector('#app') as HTMLElement);

function Effects(sinks) {
  const { sessionStorage } = SessionStorage(sinks);
  const dom = domDriver(sinks.dom);

  return { dom, sessionStorage };
}

run(Main, Effects);
```

## API

### `SessionStorage(sinks: SessionStorageSinks): SessionStorageSources;`

An Effect component for interacting with `sessionStorage`.

```typescript
import { SessionStorage } from '@motorcycle/session-storage';

function Effects(sinks) {
  const { sessionStorage } = SessionStorage(sinks);

  return { sessionStorage };
}

run(Main, Effects);
```

### `clear(): SessionStorageClearCommand;`

Remove all items from SessionStorage

```typescript
import { clear } from '@motorcycle/session-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const clear$ = constant(clear(), clearButtonClick$);

  return {
    ...,
    sessionStorage$: clear$,
  }
}
```

### `removeItem(key: string): SessionStorageRemoveItemCommand`

Remove a single item by its associated `key` from SessionStorage

```typescript
import { removeItem } from '@motorcycle/session-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const removeItem$ = map(removeItem, itemToRemove$);

  return {
    ...,
    sessionStorage$: removeItem$,
  }
}
```

### `setItem(key: string, value: string): SessionStorageSetItemCommand`

Set a single item `value` that can be looked up by the given `key`

```typescript
import { setItem } from '@motorcycle/session-storage';
import { constant } from 'most';

function Main(sources) {
  ...

  const setItem$ = map(([key, value]) => setItem(key, value), keyValue$);

  return {
    ...,
    sessionStorage$: setItem$,
  }
}
```

## Types

The types used throughout the API section

```typescript
export interface SessionStorageSinks {
  sessionStorage$: Stream<SessionStorageCommand>;
}

export interface SessionStorageSources {
  sessionStorage: SessionStorageSource;
}

export interface SessionStorageSource {
  getItem(key: string): Stream<string | null>;
  length(): Stream<number>;
}

export type SessionStorageCommand =
  SessionStorageClearCommand |
  SessionStorageSetItemCommand |
  SessionStorageRemoveItemCommand;

export type SessionStorageClearCommand =
  {
    method: 'clear';
  };

export type SessionStorageSetItemCommand =
  {
    method: 'setItem';
    key: string;
    value: string;
  };

export type SessionStorageRemoveItemCommand =
  {
    method: 'removeItem';
    key: string;
  };
```