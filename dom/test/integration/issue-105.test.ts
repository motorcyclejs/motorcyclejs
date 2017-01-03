import { run } from '@motorcycle/core';
import { makeDomDriver, button, div } from '../../src';
import { just } from 'most';
import isolate from '@cycle/isolate';
import * as assert from 'assert';

// TESTS
describe('issue 105', () => {
  it('should only emit a single event with useCapture false', (done) => {
    const { sources, sinks }: any = run<any, any>(withUseCaptureFalse, {
      dom: makeDomDriver(document.createElement('div')),
    });

    sources.dom.elements().skip(1).take(1).observe(([root]: Element[]) => {
      const button = root.querySelector('button');
      if (!button)
        done(new Error('Can not find button'));

      setTimeout(() => (button as any).click());
    });

    let called = 0;
    sinks.toggle$.skip(1).tap(() => ++called).observe(() => {
      assert.strictEqual(called, 1);
      setTimeout(done, 100);
    }).catch(done);
  });

  it('should only emit a single event with useCapture true', (done) => {
    const { sources, sinks }: any = run<any, any>(withUseCaptureTrue, {
      dom: makeDomDriver(document.createElement('div')),
    });

    sources.dom.elements().skip(1).take(1).observe(([root]: Element[]) => {
      const button = root.querySelector('button');
      if (!button)
        done(new Error('Can not find button'));

      setTimeout(() => (button as any).click());
    });

    let called = 0;
    sinks.toggle$.skip(1).tap(() => ++called).observe(() => {
      assert.strictEqual(called, 1);
      done();
    }).catch(done);
  });
});

function withUseCaptureFalse (sources: any) {
  // ORIGINAL PROBLEM:
  // -------
  // Setting `useCapture: true` causes
  // Uncaught SyntaxError: Failed to execute 'matches' on 'Element': '' is not a valid selector.
  //
  // Setting `useCapture: false` causes event to fire twice.
  const events = { click: { useCapture: false } };

  const aButton = isolate(
    augmentComponentWithEvents(Button, events),
  )(sources);

  const aButtonToggle$ = aButton.click$.scan((previous: boolean) => !previous, false).multicast();

  const childViews$ = aButton.dom.map((view: any) => [view]);

  const aHeaderSources = { childViews$ };

  const aHeader = augmentComponent(Header, { aButtonToggle$ })(aHeaderSources);

  return {
    dom: aHeader.dom,
    toggle$: aButtonToggle$,
  };
}

function withUseCaptureTrue (sources: any) {
  // ORIGINAL PROBLEM:
  // -------
  // Setting `useCapture: true` causes
  // Uncaught SyntaxError: Failed to execute 'matches' on 'Element': '' is not a valid selector.
  //
  // Setting `useCapture: false` causes event to fire twice.
  const events = { click: { useCapture: true } };

  const aButton = isolate(
    augmentComponentWithEvents(Button, events),
  )(sources);

  const aButtonToggle$ = aButton.click$.scan((previous: boolean) => !previous, false).multicast();

  const childViews$ = aButton.dom.map((view: any) => [view]);

  const aHeaderSources = { childViews$ };

  const aHeader = augmentComponent(Header, { aButtonToggle$ })(aHeaderSources);

  return {
    dom: aHeader.dom,
    toggle$: aButtonToggle$,
  };
}

function Header(sources: any) {
  const { childViews$ } = sources;
  return {
    dom: childViews$.map((childViews: any) => {
      return div(`#header`, childViews);
    }),
  };
}

function Button() {
  return {
    dom: just(
      div(`#container`, [
        button([`click me`]),
      ]),
    ),
  };
}

function augmentComponentWithEvents(
  Component: Function,
  events: { [name: string]: { useCapture?: boolean } },
) {
  return function AugmentationComponent(sources: any) {
    const sinks = Component(sources);

    Object.keys(events)
      .forEach(function (key) {
        sinks[`${key}$`] = sources.dom.events(key, events[key]);
      });

    return sinks;
  };
}

function augmentComponent(Component: any, augmentationSinks: any) {
  return function AugmentationComponent(sources: any) {
    const sinks = Component(sources);

    return Object.assign(sinks, augmentationSinks);
  };
}
