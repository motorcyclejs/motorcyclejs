import { Sinks, Sources } from '../types';
import { Stream, map } from 'most';
import { addItemStream, todoAppView } from '../ui/todoApp';

import { Item } from '../domain/model/Item';
import { addItemService } from './';
import { itemView } from '../ui/item'
import { map as rMap } from 'ramda';

export function Main(sources: Sources): Sinks {
  const { dom, items$ } = sources;

  const addItem$ = addItemStream(dom);

  const addedItem$ = map(addItemService, addItem$);

  const itemViews$ = map(rMap(itemView), items$);

  const view$ = map(todoAppView, itemViews$);

  return { view$, addItem$: addedItem$ };
}
