import * as assert from 'assert'
import { div, h } from './'
import { vNodeWrapper } from './vNodeWrapper'

describe('vNodeWrapper', () => {
  it('wraps a vNode in a vNode representation of an element', () => {
    const divElement = document.createElement('div')
    const vNode = h('h1', {}, 'Hello')
    const { element, children } = vNodeWrapper(divElement)(vNode)

    assert.strictEqual(divElement, element)
    assert.strictEqual(children && children[0], vNode)
  })

  it('returns a vNode if identical to rootElement', () => {
    const element = document.createElement('div')
    const vNode = div()

    assert.strictEqual(vNodeWrapper(element)(vNode), vNode)
  })
})
