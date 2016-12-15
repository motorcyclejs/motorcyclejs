# @motorcycle/run

> Type-Safe Functional and Reactive Framework for Modern Browsers

This is the core of Motorcycle.js creating your applicaton loop tied together
with most.js. It separates your application logic into a pure function, and
your side-effectful code into drivers.

## Let me have it!
```sh
npm install --save @motorcycle/run
```

**Warning:** This library makes use of an ES6 Proxy which can not be polyfilled.
This library **only** supports modern browsers with the feature.

## API

### `run`

```typescript
run<Sources, Sinks>(
  main: Component<Sources, Sinks>,
  effects: Component<Sinks, Sources>): RunReturn<Sources, Sinks>;
```

This function creates a circular dependencies between your `main` and `effects`
functions. The input to `main` is the output of `effects` and the input to `effects`
is the output of `main`. The return values of `main` and `effects` both must be
objects.

```typescript
import { run } from '@motorcycle/run'
import { makeDomDriver, div, button, h2 } from '@motorcycle/dom';

function main(sources) {
  const click$ = sources.dom.select('button').events('click');

  const count$ = click$.scan(x => x + 1, 0);

  const view$ = count$.map(count =>
    div([
      h2(`Clicked ${count} times`),
      button('Click me')
    ])
  )

  return { view$ }
}

const domDriver = makeDomDriver(document.querySelector('#app'));

function effects(sinks) {
  const dom = domDriver(sinks.view$)

  return { dom }
}

run(main, effects)
```

## Types

### Component

```typescript
export interface Component<Sources, Sinks> {
  (sources: Sources): Sinks;
}
```

### RunReturn

```typescript
export interface RunReturn<Sources, Sinks> {
  sources: Sources;
  sinks: Sinks;
  dispose: Function;
}
```