import { DomSinks, DomSources } from '../';
import {
  TodoRepositorySinks,
  TodoRepositorySources,
} from '../../domain/model/Todo';

export type Sinks =
  TodoRepositorySinks &
  DomSinks;

export type Sources =
  TodoRepositorySources &
  DomSources;
