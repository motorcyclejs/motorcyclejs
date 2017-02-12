import { VNode, div, h1, header, input, section, ul } from '@motorcycle/dom';

import { todoAppStyles } from './';

const HEADING = `todos`;

const NEW_ITEM_PLACEHOLDER = `What needs to be done?`;

export function view(items: Array<VNode>): VNode {
  const host =
    div(
      {
        className: todoAppStyles.hostClass,
      },
      [
        header(
          [
            h1(
              {
                className: todoAppStyles.headingClass,
              },
              HEADING,
            ),
            input(
              {
                className: todoAppStyles.newItemClass,
                placeholder: NEW_ITEM_PLACEHOLDER,
                autofocus: true,
                update: (_, vNode) => { (vNode.element as HTMLInputElement).value = ``; },
              },
            ),
          ],
        ),
        section(
          [
            ul(
              {
                className: todoAppStyles.itemsClass,
              },
              items,
            ),
          ],
        ),
      ],
    );

  return host;
}
