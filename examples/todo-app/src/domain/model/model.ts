export interface Todo {
  readonly id: number;
  readonly completed: boolean;
  readonly title: Title;
}

export interface Title {
  readonly value: string;
}
