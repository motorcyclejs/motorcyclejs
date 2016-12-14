import { DomSource, EventsFnOptions, VNode } from '../types';
import { Stream, empty } from 'most';

export interface MockConfig {
  [name: string]: (MockConfig | Stream<any>);
}

const SCOPE_PREFIX = '___';

export class MockedDomSource implements DomSource {
  private _elements: any;

  constructor(private _mockConfig: MockConfig) {
    if ((_mockConfig as any).elements) {
      this._elements = (_mockConfig as any).elements;
    } else {
      this._elements = empty();
    }
  }

  public namespace() {
    return [];
  }

  public elements(): any {
    return this._elements;
  }

  public events(eventType: string, options?: EventsFnOptions): Stream<any> {
    const mockConfig = void options ? this._mockConfig : this._mockConfig;
    const keys = Object.keys(mockConfig);
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i];
      if (key === eventType) {
        return mockConfig[key] as Stream<Event>;
      }
    }
    return empty() as Stream<Event>;
  }

  public select(selector: string): MockedDomSource {
    const mockConfig = this._mockConfig;
    const keys = Object.keys(mockConfig);
    const keysLen = keys.length;
    for (let i = 0; i < keysLen; i++) {
      const key = keys[i];
      if (key === selector) {
        return new MockedDomSource(mockConfig[key] as MockConfig);
      }
    }
    return new MockedDomSource({} as MockConfig);
  }

  public isolateSource(source: MockedDomSource, scope: string): MockedDomSource {
    return source.select('.' + SCOPE_PREFIX + scope);
  }

  public isolateSink(sink: any, scope: string): Stream<VNode> {
    return sink.map((vnode: VNode) => {
      if ((vnode.className as string).indexOf(SCOPE_PREFIX + scope) !== -1) {
        return vnode;
      } else {
        vnode.className += `.${SCOPE_PREFIX}${scope}`;
        return vnode;
      }
    });
  }
}

export function mockDomSource(mockConfig: MockConfig): MockedDomSource {
  return new MockedDomSource(mockConfig);
}
