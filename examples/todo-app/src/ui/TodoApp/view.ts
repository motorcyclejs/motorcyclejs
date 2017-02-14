import {
  ElementVirtualNode,
  VNode,
  a,
  button,
  footer,
  h1,
  header,
  input,
  label,
  li,
  section,
  span,
  ul,
} from '@motorcycle/dom';
import { Model, todoAppStyles } from './';

import { classes } from 'typestyle';

const HEADING = `todos`;

const NEW_ITEM_PLACEHOLDER = `What needs to be done?`;

export function view(model: Model): VNode {
  const {
    todoItems,
    activeTodoItemCount,
    completedTodoItemCount,
    todoItemCount } = model;

  const host =
    section(
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
                className: todoAppStyles.newTodoClass,
                placeholder: NEW_ITEM_PLACEHOLDER,
                autofocus: true,
                update: (_, vNode) => { (vNode.element as HTMLInputElement).value = ``; },
              },
            ),
          ],
        ),
        section(
          {
            className: classes(
              todoAppStyles.mainClass,
              !todoItemCount && todoAppStyles.hideClass,
            ),
          },
          [
            input(
              {
                id: `toggle-all`,
                className: todoAppStyles.toggleAllClass,
                type: `checkbox`,
              },
            ),
            label(
              {
                attrs: {
                  for: `toggle-all`,
                },
              },
            ),
            ul(
              {
                className: todoAppStyles.todoListClass,
              },
              todoItems,
            ),
            footer(
              {
                className: todoAppStyles.footerClass,
              },
              [
                span(
                  {
                    className: todoAppStyles.todoCountClass,
                  },
                  [
                    `${activeTodoItemCount} item${activeTodoItemCount > 1 ? 's' : ''} left`,
                  ],
                ),
                ul(
                  {
                    className: todoAppStyles.filtersClass,
                  },
                  [
                    li(
                      [
                        a(
                          {
                            href: `/`,
                          },
                          [`All`],
                        ),
                      ],
                    ),
                    li(
                      [
                        a(
                          {
                            href: `/active`,
                          },
                          [`Active`],
                        ),
                      ],
                    ),
                    li(
                      [
                        a(
                          {
                            href: `/completed`,
                          },
                          [`Completed`],
                        ),
                      ],
                    ),
                  ],
                ),
                button(
                  {
                    className: classes(
                      todoAppStyles.clearCompletedClass,
                      !completedTodoItemCount && todoAppStyles.hideClass
                    ),
                  },
                  [
                    `Clear completed`,
                  ],
                ),
              ],
            ),
          ],
        ),
      ],
    );

  return host;
}
