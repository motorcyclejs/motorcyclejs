import {
  Item,
  ItemRepositorySinks,
  ItemRepositorySources,
} from '../../domain/model/Item';
import { LocalStorage, setItem } from '@motorcycle/local-storage';
import { Stream, map, never } from 'most';

import { Title } from '../../domain/model/Title';
import { proxy } from 'most-proxy';
import { sample } from '@most/sample';

const DB_NAME = `todos-motorcycle`;

export function LocalStorageItemRepository(sinks: ItemRepositorySinks): ItemRepositorySources {
  const { attach, stream: proxyItems$ } = proxy<Array<Item>>();

  const { addItem$ } = sinks;

  const json$ = sample(toJson, addItem$, proxyItems$.tap(console.log));

  const setItemCommand$ = map(setItem(DB_NAME), json$);

  const localStorage$ = setItemCommand$;

  const { localStorage: { getItem } } = LocalStorage({ localStorage$ });

  const items$: Stream<Array<Item>> = attach(map(toItems, getItem(DB_NAME)));

  return { items$ };
}

function toJson(item: Item, items: Array<Item>): string {
  return JSON.stringify(items.concat(item).map(toObj));
}

function toObj(item: Item): ItemObj {
  return {
    id: item.id(),
    completed: item.completed(),
    title: item.title().value(),
  };
}

function toItems(jsonItems: string | null): Array<Item> {
  if (!jsonItems)
    return [];

  const itemObjs: Array<ItemObj> = JSON.parse(jsonItems);

  const items: Array<Item> = itemObjs.map(toItem);

  return items;
}

interface ItemObj {
  id: number;
  completed: boolean;
  title: string;
}

function toItem(itemObj: ItemObj): Item {
  const { id, completed, title } = itemObj;

  return new Item(id, completed, new Title(title));
}
