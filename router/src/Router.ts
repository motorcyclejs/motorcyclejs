import { HistorySources } from '@motorcycle/history';
import { RouterSource } from './RouterSource';

export function Router(sinks: HistorySources): RouterSources {
  const router = new RouterSource(sinks.history$, []);

  return { router };
};

export type RouterSinks = HistorySources;

export interface RouterSources {
  router: RouterSource;
}
