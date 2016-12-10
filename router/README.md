# @motorcycle/router

> Standard Router Driver for Motorcycle.js

A driver built on top of [@motorcycle/history](https://github.com/motorcyclejs/history)
and [switch-path](https://github.com/staltz/switch-path) to ease the pain of routing.
Works server-side and in browsers!

## Let me have it!
```sh
npm install --save @motorcycle/router
```

## Basic Usage

```typescript
import { run } from '@motorcycle/core';
import { makeDOMDriver, div, h1 } from '@motorcycle/dom';
import { routerDriver } from '@motorcycle/router';
import { of } from 'most';

function main(sources) {
  const match$ = sources.router.define({
    '/': HomeComponent,
    '/other': OtherComponent
  });

  const page$ = match$.map(({path, value}) => {
    return value({...sources, router: sources.router.path(path)});
  });

  return {
    DOM: page$.map(c => c.DOM).switch(),
    router: of('/other')
  };
}

run(main, {
  DOM: makeDOMDriver('#app'),
  router: routerDriver,
})

function HomeComponent() {
  return {
    DOM: of(div([h1('home')]))
  }
}

function OtherComponent() {
  return {
    DOM: of(div([h1('other')]))
  }
}
```

## API

For all types not defined here, please refer to `@motorcycle/history`'s type
documentation [here](https://github.com/motorcyclejs/history#types)

#### `routerDriver(sink$: Stream<HistoryInput | Path>): RouterSource`

This is the main API of this driver. This function simply wraps `@motorcycle/history`
and returns a source object containing methods instead of a stream.

#### `Router: RouterHOC`

A convenience function, to more declaratively define your routes to
*Components*. It returns a stream of your currently matched Component.
When using the router driver directly there is more flexibility. With
the Router function, you must use routes to match to Components.

```typescript
function main(sources: Sources): Sinks {
  const sinks$: Stream<Sinks> =
    Router({
      '/': HomeComponent, // HomeComponent :: (sources: Sources) => Sinks;
      '/profile: {
        '/': ProfileComponent,
        '/:id': (id: number) => (sources: Sources) => ProfileId({...sources, id}),
      }
    }, sources);

  return {
    DOM: sinks$.map(sinks => sinks.DOM).switch(),
    router: sinks$.map(sinks => sinks.router.switch())
  };
}
```

## Types

#### `RouterSource`

This is a type representation of the object passed into your main function.

```typescript
export interface RouterSource {
  history(): Stream<Location>;
  path(pathname: Pathname): RouterSource;
  define(routes: RouteDefinitions): Stream<DefineReturn>;
  createHref(path: Pathname): Pathname;
}
```

`history(): Stream<Location>` - This method allows you to reach the underlying
stream provided by `@motorcycle/history`.

`path(pathname: Pathname): RouterSource` - This method allows you to created
nested router instances, very much like `DOM.select()` creates a new place in the
DOM tree to look for elements and events, this allows dynamically created routes
that can be matched that are decoupled from any parent routes.

`define(routes: RouteDefinitions): Stream<DefineReturn>` - This method takes
an object (anything supported by switch-path) of keys that represent your routes
and returns a stream with an object that repesents any matches.

`createHref(path: Pathname): Pathname` - This method allows you to create Hrefs
that are namespaced at any RouterSource instance.

```typescript
const nestedRouter = sources.router.path('/some').path('/path')

const href = nestedRouter.createHref('/unaware/of/nesting')

console.log(href) '/some/path/unaware/of/nesting')
```

#### `DefineReturn`

```typescript
export interface DefineReturn {
  location: Location;
  createHref: (path: Pathname) => Pathname;
  path: string | null;
  value: any | null;
}
```

#### `RouteDefinitions`
```typescript
export interface RouteDefinitions {
  [key: Pathname]: any;
}
```

#### `RouterHOC`
```typescript
export interface RouterHOC {
  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>,
    sources: RouterSources<Sources>): Stream<Sinks>;

  <Sources, Sinks>(definitions: RouterDefinitions<Sources, Sinks>):
    (sources: RouterSources<Sources>) => Stream<Sinks>;
}
```