import { DomSource, VNode } from '@motorcycle/dom';

import { Stream } from 'most';

export interface DomSinks {
  view$: Stream<VNode>;
};

export interface DomSources {
  dom: DomSource;
}
