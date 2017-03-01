import { ApplicationSinks, ApplicationSources } from '../../application';
import { DomSinks, DomSources, VNode } from '@motorcycle/dom';

export type Sinks =
  DomSinks &
  ApplicationSinks;

export type Sources =
  DomSources &
  ApplicationSources;

export type Model =
  {
    todoItems: Array<VNode>;
    activeTodoItemCount: number;
    completedTodoItemCount: number;
    todoItemCount: number;
  };
