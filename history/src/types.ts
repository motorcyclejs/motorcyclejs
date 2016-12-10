import { Path } from 'prehistoric';

export interface PushHistoryInput {
  type: 'push';
  path: Path;
  state?: any;
};

export interface ReplaceHistoryInput {
  type: 'replace';
  path: Path;
  state?: any;
};

export interface GoHistoryInput {
  type: 'go';
  amount: number;
};

export interface GoBackHistoryInput {
  type: 'goBack';
};

export interface GoForwardHistoryInput {
  type: 'goForward';
};

export type HistoryInput =
  PushHistoryInput
  | ReplaceHistoryInput
  | GoHistoryInput
  | GoBackHistoryInput
  | GoForwardHistoryInput;