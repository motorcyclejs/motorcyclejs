import { Motorcycle, Sinks, Sources } from './ui';
import { normalize, setupPage } from 'csstips';

import { History } from '../../history/src';
import { Router } from '../../router/src';
import { cssRaw } from 'typestyle';
import { makeDomComponent } from '../../dom/src';
import { run } from '../../run/src';

const container = `#app-container`;

cssRaw(`${container} {
  background-color: #2D242D;
  color: #FFFFFF;
}
`);

normalize();
setupPage(container);

const rootElement = document.querySelector(container) as HTMLElement;

const Dom = makeDomComponent(rootElement);

run<Sources, Sinks>(Motorcycle, (sinks) => ({ ...Dom(sinks), ...Router(History(sinks)) }));
