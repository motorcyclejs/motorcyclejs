import { Item, ItemRepository, createItem } from '../domain/model/Item';

import { Title } from '../domain/model/Title';

export function addItemService(title: string): Item {
  const item = createItem(new Title(title));

  return item;
}
