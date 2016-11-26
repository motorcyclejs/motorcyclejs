import { Stream } from 'most';
import { HistoryInput, Pathname } from '@motorcycle/history';

export interface RouteDefinitions {
  [sourcePath: string]: any;
}

export type RouterInput = Stream<HistoryInput | Pathname>;

export {
  HistoryInput,
  PushHistoryInput,
  ReplaceHistoryInput,
  GoHistoryInput,
  GoBackHistoryInput,
  GoForwardHistoryInput,
  Pathname,
  BrowserHistoryOptions,
  MemoryHistoryOptions,
  HashHistoryOptions,
  Location,
  LocationAndKey,
} from '@motorcycle/history';
