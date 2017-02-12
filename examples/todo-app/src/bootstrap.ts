import { Sinks, Sources, TodoApp } from './ui/TodoApp';

import {
  LocalStorageTodoRepository,
} from './infrastructure/persistence/LocalStorageTodoRepository';
import { makeDomDriver } from '@motorcycle/dom';
import { run } from '@motorcycle/run';

const rootElement: HTMLDivElement =
  document.querySelector('#app-container') as HTMLDivElement;

const domDriver = makeDomDriver(rootElement);

function Effects(sinks: Sinks): Sources {
  const dom = domDriver(sinks.view$);

  const { todos$ } = LocalStorageTodoRepository(sinks);

  return { dom, todos$ };
}

run(TodoApp, Effects);
