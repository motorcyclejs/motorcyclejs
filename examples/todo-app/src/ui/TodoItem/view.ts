import { Model, TodoItemStyles } from './';
import { VNode, button, input, label, li } from '@motorcycle/dom';

import { classes } from 'typestyle';

export function view(model: Model): VNode {
  const { todo, editing } = model;

  const host =
    li(
      {
        className: classes(
          TodoItemStyles.itemClass,
          todo.completed() && TodoItemStyles.completedClass,
          editing && TodoItemStyles.editingClass,
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
          },
        ),
        !editing ? null :
        input(
          {
            className: TodoItemStyles.editClass,
            value: todo.title().value(),
          },
        ),
      ],
    );

  return host;
}
