import {
  Item,
  ItemRepositorySinks,
  ItemRepositorySources,
} from '../../domain/model/Item';
import { LocalStorage, setItem } from '@motorcycle/local-storage';
import { Stream, map, never } from 'most';
import { concat as rConcat, map as rMap } from 'ramda';

import { Title } from '../../domain/model/Title';
import { proxy } from 'most-proxy';
import { sample } from '@most/sample';

const DB_NAME = `todos-motorcycle`;

export function LocalStorageItemRepository(sinks: ItemRepositorySinks): ItemRepositorySources {
  const { attach, stream: proxyItems$ } = proxy<Array<Item>>();

  const { addItem$ } = sinks;

  const jsonItems$ = sample(toJson, addItem$, proxyItems$);

  const setItemCommand$ = map(setItem(DB_NAME), jsonItems$);

  const localStorage$ = setItemCommand$;

  const { localStorage: { getItem } } = LocalStorage({ localStorage$ });

  const items$ = attach(map(toItems, getItem(DB_NAME)));

  return { items$ };
}

function toJson(item: Item, items: Array<Item>): string {
  return JSON.stringify(rMap(toObj, rConcat(items, [item])));
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

  return rMap(toItem, itemObjs);
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
