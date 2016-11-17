# Motorcycle History

> Standard History Driver for Motorcycle.js

Make use of the HTML5 History API within your Motorcycle.js applications.
Built on top of the [history.js](https://github.com/mjackson/history) library.

Built with the lovely TypeScript! :fire:

## Let me have it!
```sh
npm install --save @motorcycle/history
```

## API

### Driver Factory Functions

#### `makeHistoryDriver(options?: BrowserHistoryOptions): HistoryDriver<LocationAndKey>`

This is the make function you'll want to use for browsers that support HTML5 History.

FYI: All browsers that are officially supported by `@motorcycle/dom` also support the HTML5 History API.

```typescript
import { run } from '@motorcycle/core';
import { makeDOMDriver, VNode, div, h2 } from '@motorcycle/dom';
import { makeHistoryDriver, LocationAndKey, Pathname } from '@motorcycle/history';

function main (sources) {
  const click$: Stream<Event> =
    sources.DOM.select('a').events('click')
      .tap(ev => ev.preventDefault());

  const route$: Stream<Pathname> =
    click$.map(event => event.target.href);

  const view$: Stream<VNode> =
    sources.history.map(view)

  return {
    DOM: view$
    history: route$,
  }
}

function view (location: LocationAndKey): VNode {
  return div({}, [
    h2({}, [ `You are currently at route: ${location.pathname}` ])
  ])
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: makeHistoryDriver(),
})
```

#### `makeMemoryHistoryDriver(options?: MemoryHistoryOptions): HistoryDriver<LocationAndKey>`

This creates a History Driver that works using the history library's MemoryHistory.
This can be useful when you need to run something via node.js (perhaps server-side rendering)
or in an environment such as React Native (no, there is not an official driver yet).

```typescript
import { createServer } from 'http';

import { run } from '@motorcycle/core';
import { makeHTMLDriver, VNode, div, h2 } from '@motorcycle/dom';
import { makeMemoryHistoryDriver, LocationAndKey, Pathname } from '@motorcycle/history';

function main (sources) {
  const click$: Stream<Event> =
    sources.DOM.select('a').events('click');
      .tap(ev => ev.preventDefault());

  const route$: Stream<Pathname> =
    click$.map(event => event.target.href);

  const view$: Stream<VNode> =
    sources.history.map(view)

  return {
    DOM: view$,
    history: route$,
  }
}

function view (location: LocationAndKey): VNode {
  return div({}, [
    h2({}, [ `You are currently at route: ${location.pathname}` ])
  ])
}

createServer(function (req, res) {
  run(main, {
    DOM: makeHTMLDriver(res.end),
    history: makeMemoryHistoryDriver({
      initialEntries: [ req.url ],
    }),
  })
})

```

#### `makeHashHistoryDriver(options?: HashHistoryOptions): HistoryDriver<Location>`

If you need to support browsers that do not support the History API you can use this!

```typescript
import { run } from '@motorcycle/core';
import { makeDOMDriver, VNode, div, h2 } from '@motorcycle/dom';
import { makeHashHistoryDriver, LocationAndKey, Pathname } from '@motorcycle/history';

function main (sources) {
  const click$: Stream<Event> =
    sources.DOM.select('a').events('click');
      .tap(ev => ev.preventDefault());

  const route$: Stream<Pathname> =
    click$.map(event => event.target.href);

  const view$: Stream<VNode> =
    sources.history.map(view)

  return {
    DOM: view$,
    history: route$,
  }
}

function view (location: LocationAndKey): VNode {
  return div({}, [
    h2({}, [ `You are currently at route: ${location.pathname}` ])
  ])
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: makeHashHistoryDriver(),
})
```

### Higher Order Drivers

#### `captureClicks(historyDriver: HistoryDriver<any>): HistoryDriver<any>`

WARNING: Magic ensues - Proceed with caution :smiley:

This is a High Order Driver (HOD), that means it receives a driver as its input and
returns another driver. This HOD allows you to automagically capture any clicks on
anchor elements so your application doesn't have to be explicit about listening to link
clicks.

```typescript
import { captureClicks, makeHistoryDriver } from '@motorcycle/history';

// other stuff :)

run(main, {
  // notice it wraps the HistoryDriver that `makeHistoryDriver()` *returns*
  // and not the function itself
  history: captureClicks(makeHistoryDriver()),
})
```

### Types

#### `HistoryDriver<T>`
```typescript
export interface HistoryDriver<T> {
  (sink$: Stream<HistoryInput | Pathname>): Stream<T>;
}
```

#### `HistoryInput`
```typescript
export type HistoryInput =
  PushHistoryInput
  | ReplaceHistoryInput
  | GoHistoryInput
  | GoBackHistoryInput
  | GoForwardHistoryInput;

export interface PushHistoryInput {
  type: 'push';
  pathname: Pathname;
  state?: any;
};

export interface ReplaceHistoryInput {
  type: 'replace';
  pathname: Pathname;
  state?: any;
};

export interface GoHistoryInput {
  type: 'go';
  amount: number;
};

export interface GoBackHistoryInput {
  type: 'goBack';
};

export interface GoForwardHistoryInput {
  type: 'goForward';
};
```

#### `Pathname`
```typescript
// Pathname is used to describe the type of string expected
// all strings are paths that represent URLs like '/home' or '/profile'
export type Pathname = string;
```

#### `BrowserHistoryOptions`
```typescript
export interface BrowserHistoryOptions {
  // The base URL of the app.
  // Default: ''
  basename?: string;

  // Set true to force full page refreshes.
  // Default: false
  forceRefresh?: boolean;

  // The length of `location.key`.
  // Default: 6
  keyLength?: number;

  // A function to use to confirm navigation with the user.
  // Default: (message, callback) => callback(window.confirm(message))
  getUserConfirmation?: GetUserConfirmation;
}
```

#### `MemoryHistoryOptions`
```typescript
export interface MemoryHistoryOptions {
  // The initial URLs in the history stack.
  // Default: ['/']
  initialEntries?: string[];

  // The starting index in the history stack.
  // Default: 0
  initialIndex?: number;

  // The length of `location.key`.
  // Default: 6
  keyLength?: number;

  // A function to use to confirm navigation with the user. Required
  // if you return string prompts from transition hooks.
  // Default: null
  getUserConfirmation?: GetUserConfirmation;
}
```

#### `HashHistoryOptions`
```typescript
export interface HashHistoryOptions {
  // The base URL of the app.
  // Default: ''
  basename?: string;

  // The hash type to use.
  // Default: 'slash'
  hashType?: HashType;

  // A function to use to confirm navigation with the user.
  // Default: (message, callback) => callback(window.confirm(message))
  getUserConfirmation?: GetUserConfirmation;
}
```

#### `Location`
```typescript
export interface Location {
  // The path of the URL.
  pathname: string;

  // The URL query string
  search?: string;

  // The URL hash fragment
  hash?: string;

  // Some extra state for this location that does not reside
  // in the URL (supported in `createBrowserHistory` and `createMemoryHistory`).
  state?: any;
}
```

#### `LocationAndKey`
```typescript
export interface LocationAndKey extends Location {
  // A unique string representing this location
  // (supported in `createBrowserHistory` and `createMemoryHistory`).
  key?: string;
}
```

#### `GetUserConfirmation`
```typescript
export interface GetUserConfirmation {
  (message: string, callback: (continueTransition: boolean) => void): void;
}
```

#### `HashType`
```typescript
export type HashType = 'slash' | 'noslash' | 'hashbang';
```