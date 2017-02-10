import { Item } from './Item';
import { Stream } from 'most';

export type ItemRepository = (_: ItemRepositorySinks) => ItemRepositorySources;

export interface ItemRepositorySinks {
  addItem$: Stream<Item>;
}

export interface ItemRepositorySources {
  items$: Stream<Array<Item>>;
}
