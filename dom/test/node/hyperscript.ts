/// <reference path="../typings.d.ts" />

import * as assert from 'assert'
import { h, div } from '../../src/index'

describe('hyperscript', () => {
  it('should return a vnode object', () => {
    const data = {}
    const vnode = h('div', data, 'hello')

    assert(vnode.sel === 'div')
    assert(vnode.data === data)
    assert(vnode.text === 'hello')
  })

  describe('helpers', () => {
    it('should return a vnode object', () => {
      const data = {}
      const vnode = div(data, 'hello')

      assert(vnode.sel === 'div')
      assert(vnode.data === data)
      assert(vnode.text === 'hello')
    })

    it('should render numbers as textContent', () => {
      const data = {}
      const vnode = div('.hi', data, 0)

      assert(vnode.sel === 'div.hi')
      assert(vnode.data === data)
      assert(vnode.text === '0')
    })
  })
})
