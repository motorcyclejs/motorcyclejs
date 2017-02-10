import { Item } from './';
import { Title } from '../Title';

export function createItem(title: Title): Item {
  return new Item(
    Date.now(),
    false,
    title,
  );
}
