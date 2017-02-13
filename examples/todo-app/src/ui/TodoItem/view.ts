import { Model, TodoItemStyles } from './';
import { VNode, button, input, label, li } from '@motorcycle/dom';

import { classes } from 'typestyle';

export function view(model: Model): VNode {
  const { todo } = model;

  const host =
    li(
      {
        className: classes(
          TodoItemStyles.itemClass,
          todo.completed() && TodoItemStyles.completedClass,
        ),
        attrs: {
          'data-id': todo.id(),
        },
      },
      [
        input(
          {
            className: TodoItemStyles.toggleClass,
            type: `checkbox`,
            checked: todo.completed(),
          },
        ),
        label(
          {
            className: TodoItemStyles.labelClass,
          },
          todo.title().value(),
        ),
        button(
          {
            className: TodoItemStyles.destroyClass,
          }
        ),
      ],
    );

  return host;
}
