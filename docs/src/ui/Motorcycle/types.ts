import { DomSinks, DomSources } from '../../../../dom/src';

import { HistorySinks } from '../../../../history/src';
import { RouterSources } from '../../../../router/src';

export type Sources = DomSources & RouterSources;

export type Sinks = DomSinks & HistorySinks;
