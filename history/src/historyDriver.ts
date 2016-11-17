import { Stream } from 'most';
import { createBrowserHistory, createMemoryHistory, createHashHistory } from 'history';
import { createHistory$ } from './createHistory$';
import {
  BrowserHistoryOptions,
  MemoryHistoryOptions,
  HashHistoryOptions,
  GoBackHistoryInput,
  GoForwardHistoryInput,
  GoHistoryInput,
  PushHistoryInput,
  ReplaceHistoryInput,
  HistoryInput,
  Location,
  LocationAndKey,
} from './types';

/**
 * Create a History Driver to be used in the browser.
 */
export function makeHistoryDriver(options?: BrowserHistoryOptions) {
  const history = createBrowserHistory(options);

  return function historyDriver(sink$: Stream<HistoryInput | string>): Stream<LocationAndKey> {
    return createHistory$(history, sink$);
  };
}

/**
 * Create a History Driver to be used in non-browser enviroments
 * such as server-side node.js.
 */
export function makeMemoryHistoryDriver(options?: MemoryHistoryOptions) {
  const history = createMemoryHistory(options);

  return function serverHistoryDriver(sink$: Stream<HistoryInput | string>): Stream<Location> {
    return createHistory$(history, sink$);
  };
}

/**
 * Create a History Driver for older browsers using hash routing
 */
export function makeHashHistoryDriver(options?: HashHistoryOptions) {
  const history = createHashHistory(options);

  return function hashHistoryDriver(sink$: Stream<HistoryInput | string>): Stream<Location> {
    return createHistory$(history, sink$);
  };
}