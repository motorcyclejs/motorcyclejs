# @motorcycle/dom

> Standard DOM Driver for Motorcycle.js

A Driver for Motorcycle.js built to interact with the DOM.

## Let me have it!
```sh
npm install --save @motorcycle/dom
```

## Polyfills

Internally this driver makes direct use of ES2015 `Map` and `Array.from`, if
you plan to support browser that do not natively support these features a polyfill
will need to be used.

# API

- [`makeDomDriver`](#makeDomDriver)
- [`mockDomSource`](#mockDomSource)
- [`h`](#h)
- [`hasCssSelector`](#hasCssSelector)

### <a id="makeDomDriver"></a> `makeDomDriver(container, options)`

A factory for the DOM driver function.

Takes a `container` to define the target on the existing DOM which this
driver will operate on, and an `options` object as the second argument. The
input to this driver is a stream of virtual DOM objects, or in other words,
"VNode" objects. The output of this driver is a "DomSource": a
collection of streams queried with the methods `select()` and `events()`.

`DomSource.select(selector)` returns a new DomSource with scope restricted to
the element(s) that matches the CSS `selector` given.

`DomSource.events(eventType, options)` returns a stream of events of
`eventType` happening on the elements that match the current DOMSource. The
event object contains the `ownerTarget` property that behaves exactly like
`currentTarget`. The reason for this is that some browsers doesn't allow
`currentTarget` property to be mutated, hence a new property is created. The
returned stream is a most.js Stream. The `options` parameter can have the
property `useCapture`, which is by default `false`, except it is `true` for
event types that do not bubble. Read more here
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
about the `useCapture` and its purpose.

`DomSource.elements()` returns a stream of the DOM elements matched by the
selectors in the DOMSource. Also, `DomSource.select(':root').elements()`
returns a stream of DOM element corresponding to the root (or container) of
the app on the DOM.

#### Arguments:

- `container: HTMLElement` the DOM selector for the element (or the element itself) to contain the rendering of the VTrees.
- `options: DomDriverOptions` an object with two optional properties:
  - `modules: array` overrides `@motorcycle/dom`'s default virtual-dom modules as
    as defined in [`src/modules`](./src/modules).

#### Return:

*(Function)* the DOM driver function. The function expects a stream of VNode as input, and outputs the DOMSource object.

- - -

### <a id="mockDomSource"></a> `mockDomSource(mockConfig)`

A factory function to create mocked DOMSource objects, for testing purposes.

Takes a `mockConfig` object as arguments, and returns
a DOMSource that can be given to any Motorcycle.js app that expects a DOMSource in
the sources, for testing.

The `mockConfig` parameter is an object specifying selectors, eventTypes and
their streams. Example:

```js
const domSource = mockDomSource({
  '.foo': {
    'click': most.of({target: {}}),
    'mouseover': most.of({target: {}}),
  },
  '.bar': {
    'scroll': most.of({target: {}}),
    elements: most.of({tagName: 'div'}),
  }
});

// Usage
const click$ = domSource.select('.foo').events('click');
const element$ = domSource.select('.bar').elements();
```

The mocked DOM Source supports isolation. It has the functions `isolateSink`
and `isolateSource` attached to it, and performs simple isolation using
classNames. *isolateSink* with scope `foo` will append the class `___foo` to
the stream of virtual DOM nodes, and *isolateSource* with scope `foo` will
perform a conventional `mockedDomSource.select('.__foo')` call.

#### Arguments:

- `mockConfig: Object` an object where keys are selector strings and values are objects. Those nested objects have `eventType` strings as keys
and values are streams you created.

#### Return:

*(Object)* fake DOM source object, with an API containing `select()` and `events()` and `elements()` which can be used just like the DOM Driver's
DOMSource.

- - -

### <a id="h"></a> `h()`

The hyperscript function `h()` is a function to create virtual DOM objects,
also known as VNodes. Call

```js
h('div.myClass', {style: {color: 'red'}}, [])
```

to create a VNode that represents a `DIV` element with className `myClass`,
styled with red color, and no children because the `[]` array was passed. The
API is `h(tagOrSelector, optionalData, optionalChildrenOrText)`.

However, usually you should use "hyperscript helpers", which are shortcut
functions based on hyperscript. There is one hyperscript helper function for
each DOM tagName, such as `h1()`, `h2()`, `div()`, `span()`, `label()`,
`input()`. For instance, the previous example could have been written
as:

```js
div('.myClass', {style: {color: 'red'}}, [])
```

There are also SVG helper functions, which apply the appropriate SVG
namespace to the resulting elements. `svg()` function creates the top-most
SVG element, and `svg.g`, `svg.polygon`, `svg.circle`, `svg.path` are for
SVG-specific child elements. Example:

```js
svg({width: 150, height: 150}, [
  svg.polygon({
    attrs: {
      class: 'triangle',
      points: '20 0 20 150 150 20'
    }
  })
])
```

### <a id="hasCssSelector"></a> `hasCssSelector(cssSelector: string, vNode: VNode): boolean`

Given a CSS selector **without** spaces, this function does not search children, it
will return `true` if the given CSS selector matches that of the VNode and `false`
if it does not. If a CSS selector **with** spaces is given it will throw an error.

```typescript
import { hasCssSelector, div } from '@motorcycle/dom';

console.log(hasCssSelector('.foo', div('.foo'))) // true
console.log(hasCssSelector('.bar', div('.foo'))) // false
console.log(hasCssSelector('div', div('.foo'))) // true
console.log(hasCssSelector('#foo', div('#foo'))) // true
console.log(hasCssSelector('.foo .bar'), div('.foo.bar')) // ERROR!
```
