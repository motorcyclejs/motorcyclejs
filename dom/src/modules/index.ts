import { Module } from 'snabbdom-ts';

import ClassModule from 'snabbdom-ts/modules/class';
import PropsModule from 'snabbdom-ts/modules/props';
import AttrsModule from 'snabbdom-ts/modules/attributes';
import EventsModule from 'snabbdom-ts/modules/eventlisteners';
import StyleModule from 'snabbdom-ts/modules/style';
import HeroModule from 'snabbdom-ts/modules/hero';
import DataSetModule from 'snabbdom-ts/modules/dataset';

export const defaultModules: Array<Module> =
  [StyleModule, PropsModule, AttrsModule];

export {
  StyleModule, ClassModule,
  PropsModule, AttrsModule,
  HeroModule, EventsModule,
  DataSetModule
}
