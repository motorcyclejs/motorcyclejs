import { DomSource, VNode } from '@motorcycle/dom';
import { ItemRepositorySinks, ItemRepositorySources } from './domain/model/Item';

import { Stream } from 'most';

export type Sinks =
  ItemRepositorySinks &
  {
    view$: Stream<VNode>;
  }

export type Sources =
  ItemRepositorySources &
  {
    dom: DomSource;
  }
