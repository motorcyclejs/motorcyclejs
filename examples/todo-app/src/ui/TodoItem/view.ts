import { Model, TodoItemStyles } from './';
import { VNode, input, label, li } from '@motorcycle/dom';

import { classes } from 'typestyle';

export function view(model: Model): VNode {
  const { todo } = model;

  const host =
    li(
      {
        className: TodoItemStyles.itemClass,
        attrs: {
          'data-id': todo.id(),
        },
      },
      [
        input(
          {
            className: TodoItemStyles.toggleClass,
            type: `checkbox`,
          },
        ),
        label(
          {
            className: classes(
              TodoItemStyles.labelClass,
              todo.completed() && TodoItemStyles.labelCompletedClass,
            ),
          },
          todo.title().value(),
        ),
      ],
    );

  return host;
}
