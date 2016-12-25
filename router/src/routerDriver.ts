import { Stream } from 'most';
import { historyDriver } from '@motorcycle/history';
import { RouterSource } from './RouterSource';
import { RouterInput } from './types';

export function routerDriver(sink$: RouterInput) {
  return new RouterSource(historyDriver(sink$), []);
};
