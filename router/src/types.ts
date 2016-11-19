import { Stream } from 'most';

export interface RouteDefinitions {
  [sourcePath: string]: any;
}

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
