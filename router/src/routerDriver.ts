import { Stream } from 'most';
import { hold } from 'most-subject';
import { DriverFn } from '@motorcycle/core';
import { makeHistoryDriver, makeHashHistoryDriver, makeMemoryHistoryDriver }
  from '@motorcycle/history';
import { RouterSource } from './RouterSource';
import {
  BrowserHistoryOptions,
  MemoryHistoryOptions,
  HashHistoryOptions,
  Pathname,
  HistoryInput,
  GoHistoryInput,
  GoBackHistoryInput,
  GoForwardHistoryInput,
  PushHistoryInput,
  ReplaceHistoryInput,
} from './types';

function getDriverFunction(options?: RouterOptions): any {
  try {
    return window && window.history
      ? makeHistoryDriver(options)
      : makeHashHistoryDriver(options);
  } catch (e) {
    return makeMemoryHistoryDriver(options);
  }
}

export type RouterOptions =
  BrowserHistoryOptions |
  MemoryHistoryOptions |
  HashHistoryOptions;

export function makeRouterDriver(options?: RouterOptions) {
  const historyDriver: (sink$: Stream<HistoryInput | Pathname>) => Stream<Location> =
    getDriverFunction(options);

  return function routerDriver(sink$: Stream<HistoryInput | Pathname>) {
    return new RouterSource(historyDriver(sink$), []);
  };
}
