import { DomSource, VNode } from '@motorcycle/dom';
import { RouterInput, RouterSource } from '@motorcycle/router';
import { Sinks, Sources } from '@motorcycle/run';

import { Stream } from 'most';

export interface DomSinks extends Sinks {
  view$: Stream<VNode>;
};

export interface DomSources extends Sources {
  dom: DomSource;
}

export interface RouterSinks extends Sinks {
  route$: RouterInput;
}

export interface RouterSources extends Sources {
  router: RouterSource;
}
