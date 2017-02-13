import { DomSource, VNode } from '@motorcycle/dom';
import { Sinks, Sources } from '@motorcycle/run';

import { Stream } from 'most';

export interface DomSinks extends Sinks {
  view$: Stream<VNode>;
};

export interface DomSources extends Sources {
  dom: DomSource;
}
