import { VNode, button, input, label, li } from '@motorcycle/dom';

import { Model } from './types';
import { TodoItemStyles } from './styles';
import { classes } from 'typestyle';

export function view(model: Model): VNode {
  const { todo, editing } = model;

  const host =
    li(
      {
        className: classes(
          TodoItemStyles.itemClass,
          todo.completed && TodoItemStyles.completedClass,
          editing && TodoItemStyles.editingClass,
        ),
        attrs: {
          'data-id': todo.id,
        },
      },
      [
        input(
          {
            className: TodoItemStyles.toggleClass,
            type: `checkbox`,
            checked: todo.completed,
          },
        ),
        label(
          {
            className: TodoItemStyles.labelClass,
          },
          todo.title,
        ),
        button(
          {
            className: TodoItemStyles.destroyClass,
          },
        ),
        input(
          {
            className: classes(
              TodoItemStyles.editClass,
              !editing && TodoItemStyles.hideClass),
            focus: editing,
            value: todo.title,
            // update(_, vNode: ElementVirtualNode<HTMLInputElement>) {
            //   const element = vNode.element;

            //   if (editing)
            //     element.value = todo.title;
            // },
          },
        ),
      ],
    );

  return host;
}
