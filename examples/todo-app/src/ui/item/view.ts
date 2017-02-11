import { VNode, input, label, li } from '@motorcycle/dom';

import { Item } from '../../domain/model/Item';
import { ItemStyles } from './';

export function itemView(item: Item): VNode {
  const host =
    li(
      {
        className: ItemStyles.item,
        attrs: {
          'data-id': item.id(),
        },
      },
      [
        input(
          {
            className: ItemStyles.toggle,
            type: `checkbox`,
          }
        ),
        label(
          {
            className: ItemStyles.label,
          },
          item.title().value()
        ),
      ]
    );

  return host;
}
