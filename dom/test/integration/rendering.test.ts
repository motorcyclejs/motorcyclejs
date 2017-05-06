import * as assert from 'assert'

import { DomSource, VNode, a, div, h2, makeDomComponent, p } from '../../src'
import { Stream, just } from 'most'

import { run } from '@motorcycle/run'

interface DomSources {
  dom: DomSource
}

interface DomSinks {
  view$: Stream<VNode>
}

describe('rendering', () => {
  it('patches text nodes initially present on rootElement', (done) => {
    function main() {
      const view$ = just(
        div('#page', {}, [
          h2('Home'),
          div({}, [
            a('.connect', { href: '/connect' }, 'Connect'),
            p(' | '),
            a('.signin', { href: '/signin' }, 'Sign In'),
          ]),
          div(`Hello world`),
        ]),
      )

      return { view$ }
    }

    const { sources, dispose } = run<DomSources, DomSinks>(main, makeDomComponent(createInitialRenderTarget()))

    sources.dom.elements().skip(1).take(1)
      .observe((elements) => {
        const rootElement = elements[0] as HTMLDivElement

        assert.strictEqual(rootElement.id, 'test')
        assert.strictEqual(rootElement.childNodes.length, 1)

        const page = rootElement.childNodes[0] as HTMLDivElement

        assert.strictEqual(page.childNodes.length, 3)

        assert.strictEqual((page.childNodes[0] as HTMLHeadingElement).tagName, 'H2')
        assert.strictEqual((page.childNodes[1] as HTMLDivElement).tagName, 'DIV')

        dispose()
        done()
      })
      .catch(done)
  })
})

function createInitialRenderTarget(): HTMLDivElement {
  const rootElement = document.createElement('div')
  rootElement.id = 'test'
  rootElement.className = 'unresolved'

  const textContainer = document.createElement('div')

  const firstTextNode = document.createTextNode('Motorcycle')

  textContainer.appendChild(firstTextNode)

  const spanElement = document.createElement('span')

  const secondTextNode = document.createTextNode('.js')

  spanElement.appendChild(secondTextNode)

  textContainer.appendChild(spanElement)
  textContainer.appendChild(spanElement)

  rootElement.appendChild(textContainer)

  document.body.appendChild(rootElement)

  return rootElement
}
