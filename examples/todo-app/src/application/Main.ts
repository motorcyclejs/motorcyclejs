import { Sinks, Sources } from '../types';
import { Stream, constant, just, map, never, startWith } from 'most';
import { addItemService, findAllItemsService } from './';
import { addItemStream, view } from '../ui/todoApp';

export function Main(sources: Sources): Sinks {
  const { dom, items$ } = sources;

  const addItem$ = addItemStream(dom);

  const addedItem$ = map(addItemService, addItem$);

  const view$ = map(view, items$);

  return { view$, addItem$: addedItem$ };
}
