import { Stream, empty } from 'most'

import { DomSource } from './types'
import { VNode } from 'mostly-dom'

export interface MockConfig {
  readonly [key: string]: MockConfig | Stream <any>
}

export function mockDomSource(
  mockConfig?: MockConfig & { elements?: Stream<Array<HTMLElement>> }): DomSource
{
  return new MockDomSource(mockConfig || {}, [])
}

const SCOPE_PREFIX = `___`

class MockDomSource implements DomSource {
  private mockConfig: MockConfig & { elements?: Stream<Array<HTMLElement>> }
  private internalNamespace: Array<string>

  public isolateSink = isolateSink
  public isolateSource = isolateSource

  constructor(
    mockConfig: MockConfig & { elements?: Stream<Array<HTMLElement>> },
    namespace: Array<string>)
  {
    this.mockConfig = mockConfig
    this.internalNamespace = namespace
  }

  public namespace(): Array<string> {
    return this.internalNamespace
  }

  public select(selector: string): DomSource {
    const trimmedSelector = selector.trim()
    const updatedNamespace = this.internalNamespace.concat(trimmedSelector)

    const mockConfig = this.mockConfig[selector] as MockConfig || {}

    return new MockDomSource(mockConfig, updatedNamespace)
  }

  public elements<T extends Element>(): Stream<Array<T>> {
    return (this.mockConfig.elements || empty()) as Stream<Array<T>>
  }

  public events<T extends Event>(eventType: string): Stream<T> {
    return (this.mockConfig[eventType] || empty()) as Stream<T>
  }
}

function isolateSource(source: DomSource, scope: string) {
  return source.select(`${SCOPE_PREFIX}${scope}`)
}

function isolateSink<T extends VNode>(vNode$: Stream<T>, scope: string) {
  const generatedScope = `${SCOPE_PREFIX}${scope}`

  return vNode$.tap((vNode) => {
    if (vNode.className && vNode.className.indexOf(generatedScope) === -1)
      vNode.className = ((vNode.className || '') + generatedScope).trim()
  })
}
