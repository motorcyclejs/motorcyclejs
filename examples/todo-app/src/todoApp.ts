import { Sinks, Sources } from './types';

import { LocalStorage } from '@motorcycle/local-storage';
import {
  LocalStorageItemRepository,
} from './infrastructure/persistence/LocalStorageItemRepository';
import { Main } from './application';
import { makeDomDriver } from '@motorcycle/dom';
import { run } from '@motorcycle/run';

const rootElement: HTMLDivElement =
  document.querySelector('#app-container') as HTMLDivElement;

const domDriver = makeDomDriver(rootElement);

function Effects(sinks: Sinks): Sources {
  const dom = domDriver(sinks.view$);

  const { items$ } = LocalStorageItemRepository(sinks);

  return { dom, items$ };
}

run(Main, Effects);
