# Motorcycle History

> Standard History Driver for Motorcycle.js

Make use of the HTML5 History API within your Motorcycle.js applications.
Built on top of the [prehistoric](https://github.com/TylorS/prehistoric) library.

Built with the lovely TypeScript! :fire:

## Let me have it!
```sh
npm install --save @motorcycle/history
```

## API

### Driver Functions

#### `historyDriver(sink$: Stream<HistoryInput | Path>): Stream<Location>`

This is the only function you'll be needing :smile:

```typescript
import { run } from '@motorcycle/core';
import { makeDOMDriver, VNode, div, h2 } from '@motorcycle/dom';
import { historyDriver, Location, Path } from '@motorcycle/history';

function main (sources) {
  const click$: Stream<Event> =
    sources.DOM.select('a').events('click')
      .tap(ev => ev.preventDefault());

  const route$: Stream<Pathname> =
    click$.map(event => event.target.pathname);

  const view$: Stream<VNode> =
    sources.history.map(view)

  return {
    DOM: view$
    history: route$,
  }
}

function view (location: Location): VNode {
  return div({}, [
    h2({}, [ `You are currently at route: ${location.path}` ])
  ])
}

run(main, {
  DOM: makeDOMDriver('#app'),
  history: historyDriver,
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
import { captureClicks, historyDriver } from '@motorcycle/history';

// other stuff :)

run(main, {
  history: captureClicks(historyDriver),
})
```

### Types

#### `HistoryDriver<T>`
```typescript
export interface HistoryDriver<T> {
  (sink$: Stream<HistoryInput | Path>): Stream<T>;
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
  path: Path;
  state?: any;
};

export interface ReplaceHistoryInput {
  type: 'replace';
  path: Path;
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

#### `Path`
```typescript
// Path is used to describe the type of string expected
// all strings are paths that represent URLs like '/home' or '/profile'
export type Path = string;
```

#### `Location`
```typescript
export interface Location {
  // The path of the URL.
  path: Path;

  // An object of parsed query strings
  queries?: any;

  // The URL hash fragment
  hash?: string;

  // Some extra state for this location that does not reside
  state?: any;
}
```