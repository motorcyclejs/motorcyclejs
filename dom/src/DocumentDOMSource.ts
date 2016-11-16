import { Stream } from 'most';
import hold from '@most/hold';
import { domEvent } from '@most/dom-event';
import { EventDelegator } from './EventDelegator';
import { IsolateModule } from './modules/isolate';
import { DOMSource } from './DOMSource';
import { VNode } from './interfaces';
import { isolateSource, isolateSink } from './isolate';
import { BodyDOMSource } from './BodyDOMSource';
import { WindowDOMSource } from './WindowDOMSource';
import { MainDOMSource } from './MainDOMSource';

const noop = () => void 0;

function getDocumentElement(): any {
  try {
    return document;
  } catch (e) {
    return {
      addEventListener: noop,
      removeEventListener: noop,
    };
  }
}

const doc = getDocumentElement();

export class DocumentDOMSource implements DOMSource {
  constructor(protected _rootElement$: Stream<HTMLElement>,
              protected _namespace: string[] = [],
              public _isolateModule: IsolateModule,
              public _delegators: Map<string, EventDelegator>) { }

  elements(): Stream<HTMLElement[]> {
    return hold<HTMLElement[]>(this._rootElement$.constant([doc]));
  }

  select (selector: string): DOMSource {
    if (typeof selector !== 'string') {
      throw new Error(`DOM driver's select() expects the argument to be a ` +
        `string as a CSS selector`);
    }
    const trimmedSelector = selector.trim();

    if (trimmedSelector === 'window')
      return new WindowDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    if (trimmedSelector === 'document')
      return new DocumentDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    if (trimmedSelector === 'body')
      return new BodyDOMSource(
        this._rootElement$,
        this._namespace,
        this._isolateModule,
        this._delegators
      );

    const childNamespace = trimmedSelector === `:root`
      ? this._namespace
      : this._namespace.concat(trimmedSelector)

    return new MainDOMSource(
      this._rootElement$,
      childNamespace,
      this._isolateModule,
      this._delegators
    )
  }

   events<T extends Event>(eventType: string) {
    return this._rootElement$.constant(doc)
      .map(element => domEvent(eventType, element) as Stream<T>)
      .switch()
      .multicast();
   }

  dispose(): void {
    this._isolateModule.reset()
  }

  public isolateSource: (source: DOMSource, scope: string) => DOMSource = isolateSource
  public isolateSink: (sink: Stream<VNode>, scope: string) => Stream<VNode> = isolateSink
}