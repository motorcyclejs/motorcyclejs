import { DomSinks, DomSources, RouterSinks, RouterSources } from '../';
import {
  TodoRepositorySinks,
  TodoRepositorySources,
} from '../../domain/model/Todo';

import { VNode } from '@motorcycle/dom';

export type Sinks =
  TodoRepositorySinks &
  DomSinks &
  RouterSinks;

export type Sources =
  TodoRepositorySources &
  DomSources &
  RouterSources;

export interface Model {
  todoItems: Array<VNode>;
  activeTodoItemCount: number;
  completedTodoItemCount: number;
  todoItemCount: number;
}
