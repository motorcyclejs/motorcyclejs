import * as assert from 'assert'

import { History, Location } from './'

import { sync } from 'most-subject'

describe(`History`, () => {
  beforeEach(() => {
    try {
      window.history.replaceState(null, '', '/')
    } catch (e) {
      Function.prototype()
    }
  })

  it('should create a location from pathname', (done: Function) => {
    const { stream, listen } = buildTest(done)

    listen(function(location: Location) {
      assert.strictEqual(location.path, '/test')
      done()
    })

    stream.next('/test')
  })

  it('should create a location from PushHistoryInput', (done: Function) => {
    const { stream, listen } = buildTest(done)

    listen(function(location: Location) {
      assert.strictEqual(location.path, '/test')
      done()
    })

    stream.next({ type: 'push', path: '/test' })
  })

  it('should create a location from ReplaceHistoryInput', (done: Function) => {
    const { stream, listen } = buildTest(done)

    listen(function(location: Location) {
      assert.strictEqual(location.path, '/test')
      done()
    })

    stream.next({ type: 'replace', path: '/test' })
  })

  it('should allow going back a route with type `go`', (done: Function) => {
    const { stream, listen } = buildTest(done)

    const expected = [
      '/test',
      '/other',
      '/test',
    ]

    listen(function(location: Location) {
      assert.strictEqual(location.path, expected.shift())

      if (expected.length === 0) done()
    })

    stream.next('/test')
    stream.next('/other')
    stream.next({ type: 'go', amount: -1 })
  })

  it('should allow going back a route with type `goBack`', (done: Function) => {
    setTimeout(() => {
      const { stream, listen } = buildTest(done)

      const expected = [
        '/test',
        '/other',
        '/test',
      ]

      listen(function(location: Location) {
        assert.strictEqual(location.path, expected.shift())

        if (expected.length === 0) done()
      })

      stream.next('/test')
      stream.next('/other')
      stream.next({ type: 'goBack' })
    })
  })

  it('should allow going forward a route with type `go`', (done: Function) => {
    const { stream, listen } = buildTest(done)

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ]

    listen(function(location: Location) {
      assert.strictEqual(location.path, expected.shift())

      if (expected.length === 0) done()
    })

    const commands =
      [
        '/test',
        '/other',
        { type: 'go', amount: -1 },
        { type: 'go', amount: 1 },
      ]

    commands.forEach(function(cmd: string, i: number) {
      setTimeout(function() {
        stream.next(cmd)
      }, i * 400)
    })
  })

  it('should allow going forward a route with type `goForward`', (done: Function) => {
    const { stream, listen } = buildTest(done)

    const expected = [
      '/test',
      '/other',
      '/test',
      '/other',
    ]

    listen(function(location: Location) {
      assert.strictEqual(location.path, expected.shift())
      if (expected.length === 0) {
        done()
      }
    })

    const commands = [
      '/test',
      '/other',
      { type: 'goBack' },
      { type: 'goForward' },
    ]

    commands.forEach(function(cmd: string, i: number) {
      setTimeout(function() {
        stream.next(cmd)
      }, i * 400)
    })

  })
})

function buildTest(done: Function) {
  const stream = sync<any>()

  const history$ = History({ history$: stream.continueWith(() => {
    done()

    return stream
  }) }).history$

  function listen(next: (location: Location) => any) {
    const observer = {
      next,
      error: (err: Error) => done(err),
      complete: () => done(),
    }

    // skip 1 to avoid initial
    return history$.skip(1).subscribe(observer)
  }

  return { listen, stream }
}
