import { Sinks, Sources } from './types';
import { VNode, events, query } from '../../../../dom/src';
import { constant, map, merge } from 'most';
import { documentation, logo } from './styles';

import { define } from '../../../../router/src';
import { documentationView } from './documentationView';
import { homeView } from './homeView';
import { prop } from 'ramda';

const routes =
  {
    '/': homeView(),
    '/documentation': documentationView(),
  };

export function Motorcycle(sources: Sources): Sinks {
  const { router, dom } = sources;

  const home$ = constant('/', events('click', query(`.${logo}`, dom)));

  const documentation$ =
    constant('/documentation', events('click', query(`.${documentation}`, dom)));

  const history$ = merge(home$, documentation$);

  const view$ = map<any, VNode>(prop('value'), define(routes, router));

  return { view$, history$ };
}
