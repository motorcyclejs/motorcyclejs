import { VNode, div, h2 } from '@motorcycle/dom';

export function view(): VNode {
  return div({}, [
    h2(`Todo App`),
  ]);
}
