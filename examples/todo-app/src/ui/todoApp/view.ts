import { VNode, div, h1, header, input, section } from '@motorcycle/dom';

import { todoAppStyles } from './';

const HEADING = `todos`;

const NEW_ITEM_PLACEHOLDER = `What needs to be done?`;

export function view(): VNode {
  const host =
    div(
      {
        className: todoAppStyles.host,
      },
      [
        header(
          [
            h1(
              {
                className: todoAppStyles.heading,
              },
              HEADING
            ),
            input(
              {
                className: todoAppStyles.newItem,
                placeholder: NEW_ITEM_PLACEHOLDER,
                autofocus: true,
                update: (_, vNode) => { (vNode.element as HTMLInputElement).value = `` }
              },
            ),
          ],
        ),
        section()
      ],
    );

  return host;
}
