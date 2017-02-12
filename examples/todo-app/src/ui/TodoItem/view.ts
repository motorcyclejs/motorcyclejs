import { Model, TodoItemStyles } from './';
import { VNode, input, label, li } from '@motorcycle/dom';

import { classes } from 'typestyle';

export function view(model: Model): VNode {
  const { key, completed, todo } = model;

  const host =
    li(
      {
        className: classes(TodoItemStyles.itemClass, key),
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
              completed && TodoItemStyles.labelCompletedClass,
            ),
          },
          todo.title().value(),
        ),
      ],
    );

  return host;
}
