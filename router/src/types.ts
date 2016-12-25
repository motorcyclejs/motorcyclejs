import { Stream } from 'most';
import { HistoryInput, Path } from '@motorcycle/history';

export interface RouteDefinitions {
  [sourcePath: string]: any;
}

export type RouterInput = Stream<HistoryInput | Path>;

export { HistoryInput, Path, Location, Queries, Hash, State } from '@motorcycle/history';
