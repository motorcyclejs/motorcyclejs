import { DomSinks, DomSources, RouterSinks, RouterSources } from '../';
import {
  TodoRepositorySinks,
  TodoRepositorySources,
} from '../../domain/model/Todo';

export type Sinks =
  TodoRepositorySinks &
  DomSinks &
  RouterSinks;

export type Sources =
  TodoRepositorySources &
  DomSources &
  RouterSources;
