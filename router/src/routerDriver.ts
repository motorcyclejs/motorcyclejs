import { Stream } from 'most';
import { makeHistoryDriver, makeHashHistoryDriver, makeMemoryHistoryDriver }
  from '@motorcycle/history';
import { RouterSource } from './RouterSource';
import {
  BrowserHistoryOptions,
  MemoryHistoryOptions,
  HashHistoryOptions,
  RouterInput,
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
  const historyDriver: (sink$: RouterInput) => Stream<Location> =
    getDriverFunction(options);

  return function routerDriver(sink$: RouterInput) {
    return new RouterSource(historyDriver(sink$), []);
  };
}
