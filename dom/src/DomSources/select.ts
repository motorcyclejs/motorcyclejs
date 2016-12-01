import { Stream } from 'most';
import { IsolateModule } from '../modules/isolate';
import { EventDelegator } from '../EventDelegator';
import { DomSource } from './DomSource';
import { MainDomSource } from './MainDomSource';
import { ElementDomSource } from './ElementDomSource';

const noop = () => void 0;

function bodyElement(): any {
  try {
    return document && document.body;
  } catch (e) {
    return {
      addEventListener: noop,
      removeEventListener: noop,
    };
  }
}

function documentElement(): any {
  try {
    return document;
  } catch (e) {
    return {
      addEventListener: noop,
      removeEventListener: noop,
    };
  }
}

function windowElement(): any {
  try {
    return window;
  } catch (e) {
    return {
      addEventListener: noop,
      removeEventListener: noop,
    };
  }
}

const specialElementMap: { [key: string]: HTMLElement } = {
  window: windowElement(),
  document: documentElement(),
  body: bodyElement(),
}

const specialElements = Object.keys(specialElementMap);

export function select(
  selector: string,
  rootElement$: Stream<HTMLElement>,
  namespace: Array<string>,
  isolateModule: IsolateModule,
  delegators: Map<string, EventDelegator>): DomSource
{
  const trimmedSelector = selector.trim();

  if (specialElements.indexOf(trimmedSelector) > -1) {
    return new ElementDomSource(
      rootElement$,
      namespace,
      isolateModule,
      delegators,
      specialElementMap[trimmedSelector],
    );
  }

  const childNamespace = trimmedSelector === `:root`
    ? namespace
    : namespace.concat(trimmedSelector);

  return new MainDomSource(
    rootElement$,
    childNamespace,
    isolateModule,
    delegators
  );
}