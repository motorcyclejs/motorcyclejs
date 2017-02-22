import { HistoryInput, Path } from '@motorcycle/history';

import { Stream } from 'most';

export interface RouteDefinitions {
  [sourcePath: string]: any;
}

export type RouterInput = Stream<HistoryInput | Path>;

export { HistoryInput, Path, Location, Queries, Hash, State } from '@motorcycle/history';
