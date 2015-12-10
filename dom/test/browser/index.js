/* global describe, it */
import assert from 'assert'
import {run} from '@motorcycle/core'
import {makeDOMDriver, div, p, span, h2, h3, h4} from '../../src'
import most from 'most'

function click(el) {
  let ev = document.createEvent(`MouseEvent`)
  ev.initMouseEvent(
      `click`,
      true /* bubble */, true /* cancelable */,
      window, null,
      0, 0, 0, 0, /* coordinates */
      false, false, false, false, /* modifier keys */
      0 /*left*/, null
  )
  el.dispatchEvent(ev)
}

function createRenderTarget(id = null) {
  let element = document.createElement(`div`)
  element.className = `cycletest`
  if (id) {
    element.id = id
  }
  document.body.appendChild(element)
  return element
}

describe(`Rendering`, () => {
  describe(`makeDomDriver`, () => {
    it(`should accept a DOM element as input`, () => {
      assert.doesNotThrow(() => makeDOMDriver(createRenderTarget()))
    })

    it(`should accept a DocumentFragment as input`, () => {
      let element = document.createDocumentFragment()
      assert.doesNotThrow(() => makeDOMDriver(element))
    })

    it(`should accept a string selection to an existing element as input`,
      () => {
        let id = `testShouldAcceptSelectorToExisting`
        createRenderTarget(id)
        assert.doesNotThrow(() => makeDOMDriver(`#${id}`))
      })
  })

  describe(`DOM Driver`, () => {
    it(`should throw if input is not an Observable<VTree>`, () => {
      let domDriver = makeDOMDriver(createRenderTarget())
      assert.throws(() => {
        domDriver({})
      }, /The DOM driver function expects as input an Observable of virtual/)
    })

    it(`should have Observable ':root' in response`, done => {
      function app() {
        return {
          DOM: most.just(
            div(`.top-most`, [
              p(`Foo`),
              span(`Bar`),
            ])
          ),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget(`fuckThisTest`)),
      })

      sources.DOM.select(`:root`).observable.forEach(root => {
        let classNameRegex = /top\-most/
        assert.strictEqual(root.tagName, `DIV`)
        assert.notStrictEqual(classNameRegex.exec(root.className), null)
        assert.strictEqual(classNameRegex.exec(root.className)[0], `top-most`)
        done()
      })
    })
  })

  it(`should have isolateSource() and isolateSink() in source`, done => {
    function app() {
      return {
        DOM: most.just(div()),
      }
    }
    const {sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget()),
    })
    assert.strictEqual(typeof sources.DOM.isolateSource, `function`)
    assert.strictEqual(typeof sources.DOM.isolateSink, `function`)
    done()
  })

  it(`should catch interactions coming from wrapped view`, done => {
    const app = () => ({
      DOM: most.just(
        div(`#top-most`, [
          h3(`.myelementclass`, {}, `Foobar`),
        ])
      ),
    })

    const {sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget()),
    })

    sources.DOM.select(`.myelementclass`).events(`click`).observe(ev => {
      assert.strictEqual(ev.type, `click`)
      assert.strictEqual(ev.target.textContent, `Foobar`)
      done()
    })

    sources.DOM.select(`:root`).observable.observe(root => {
      let myElement = root.querySelector(`.myelementclass`)
      assert.notStrictEqual(myElement, null)
      assert.notStrictEqual(typeof myElement, `undefined`)
      assert.strictEqual(myElement.tagName, `H3`)
      assert.doesNotThrow(() => {
        click(myElement)
      })
    })
  })

  it(`should render when children === falsey in a child stream`, done => {
    const app = () => ({
      DOM: most.just(div({}, [
        most.just(h2('Hello, world!'))
      ]))
    })

    const {sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget()),
    })

    sources.DOM.select(`:root`).observable.observe(root => {
      let myElement = root.querySelector(`h2`)
      assert.notStrictEqual(myElement, null)
      assert.notStrictEqual(typeof myElement, `undefined`)
      assert.strictEqual(myElement.tagName, `H2`)
      done()
    })
  })

  describe(`isolateSource`, () => {
    it(`should have the same effect as DOM.select()`, done => {
      function app() {
        return {
          DOM: most.just(
            h3(`.top-most`, [
              h2(`.bar`, `Wrong`),
              div(`.cycle-scope-foo`, [
                h4(`.bar`, `Correct`),
              ]),
            ])
          ),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      let isolatedDOMSource = sources.DOM.isolateSource(sources.DOM, `foo`)
      // Make assertions
      isolatedDOMSource.select(`.bar`).events(`click`).observe(ev => {
        assert.strictEqual(ev.type, `click`)
        assert.strictEqual(ev.target.textContent, `Correct`)

        done()
      })
      sources.DOM.select(`:root`).observable
        .observe(root => {
          let wrongElement = root.querySelector(`.bar`)
          let correctElement = root.querySelector(`.cycle-scope-foo .bar`)
          assert.notStrictEqual(wrongElement, null)
          assert.notStrictEqual(correctElement, null)
          assert.notStrictEqual(typeof wrongElement, `undefined`)
          assert.notStrictEqual(typeof correctElement, `undefined`)
          assert.strictEqual(wrongElement.tagName, `H2`)
          assert.strictEqual(correctElement.tagName, `H4`)
          assert.doesNotThrow(() => {
            click(wrongElement)
            setTimeout(() => click(correctElement), 5)
          })
          done()
        })
    })

    it(`should return source also with isolateSource and isolateSink`,
        done => {
          function app() {
            return {
              DOM: most.just(h3(`.top-most`)),
            }
          }
          let {sources} = run(app, {
            DOM: makeDOMDriver(createRenderTarget()),
          })
          let isolatedDOMSource =
            sources.DOM.isolateSource(sources.DOM, `top-most`)
          // Make assertions
          assert.strictEqual(typeof isolatedDOMSource.isolateSource, `function`)
          assert.strictEqual(typeof isolatedDOMSource.isolateSink, `function`)

          done()
        })
  })

  describe(`isolateSink`, () => {
    it(`should add a className to the vtree sink`, done => {
      function app(sources) {
        let vtree$ = most.just(
            h3(`.top-most`)
          )
        return {
          DOM: sources.DOM.isolateSink(vtree$, `foo`),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      // Make assertions
      sources.DOM.select(`:root`).observable
        .observe(root => {
          assert.notStrictEqual(root, null)
          assert.notStrictEqual(typeof root, `undefined`)
          assert.strictEqual(root.tagName, `H3`)
          assert.strictEqual(root.className, `top-most cycle-scope-foo`)
          done()
        })
    })

    it(`should prevent parent from DOM.selecting() inside the isolation`,
      done => {
        function app(sources) {
          return {
            DOM: most.just(
              h3(`.top-most`, [
                sources.DOM.isolateSink(most.just(
                  div(`.foo`, [
                    h4(`.bar`, `Wrong`),
                  ])
                ), `ISOLATION`),
                h2(`.bar`, `Correct`),
              ])
            ),
          }
        }
        let {sources} = run(app, {
          DOM: makeDOMDriver(createRenderTarget()),
        })
        sources.DOM.select(`.bar`).observable.observe(elements => {
          assert.strictEqual(Array.isArray(elements), true)
          assert.strictEqual(elements.length, 1)
          const correctElement = elements[0]
          assert.notStrictEqual(correctElement, null)
          assert.notStrictEqual(typeof correctElement, `undefined`)
          assert.strictEqual(correctElement.tagName, `H2`)
          assert.strictEqual(correctElement.textContent, `Correct`)
          done()
        })
      })

    it(`should allow parent to DOM.select() an isolation boundary`, done => {
      function app(sources) {
        return {
          DOM: most.just(
            h3(`.top-most`, [
              sources.DOM.isolateSink(most.just(
                span(`.foo`, [
                  h4(`.foo`, `Wrong`),
                ])
              ), `ISOLATION`),
            ])
          ),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      sources.DOM.select(`.foo`).observable.observe(elements => {
        assert.strictEqual(Array.isArray(elements), true)
        assert.strictEqual(elements.length, 1)
        const correctElement = elements[0]
        assert.notStrictEqual(correctElement, null)
        assert.notStrictEqual(typeof correctElement, `undefined`)
        assert.strictEqual(correctElement.tagName, `SPAN`)
        done()
      })
    })
  })

  it('should not redundantly repeat the scope className', done => {
    const app = ({DOM}) => {
      const tab1$ = most.just(span('.tab1', 'Hi'))
      const tab2$ = most.just(span('.tab2', 'Hello'))
      const first$ = DOM.isolateSink(tab1$, '1')
      const second$ = DOM.isolateSink(tab2$, '2')
      const switched$ = most.from([1, 2, 1, 2, 1, 2])
        .flatMap(i => i === 1? first$ : second$)
      return {
        DOM: switched$,
      }
    }

    const {sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget('tab1')),
    })

    sources.DOM.select(':root').observable.skip(4).take(1)
      .observe(root => {
        assert.notStrictEqual(root, null)
        assert.notStrictEqual(typeof root, 'undefined')
        assert.strictEqual(root.tagName, 'SPAN')
        assert.strictEqual(root.className, 'tab1 cycle-scope-1')
        done()
      })
  })

  it(`should catch interaction events using id in DOM.select`, done => {
    function app() {
      return {
        DOM: most.just(div([h3(`#myElementId`, `Foobar`)])),
      }
    }
    let {sources} = run(app, {
      DOM: makeDOMDriver(createRenderTarget(`parent-002`)),
    })
    // Make assertions
    sources.DOM.select(`#myElementId`).events(`click`).observe(ev => {
      assert.strictEqual(ev.type, `click`)
      assert.strictEqual(ev.target.textContent, `Foobar`)

      done()
    })
    sources.DOM.select(`:root`).observable
      .observe(root => {
        let myElement = root.querySelector(`#myElementId`)
        assert.notStrictEqual(myElement, null)
        assert.notStrictEqual(typeof myElement, `undefined`)
        assert.strictEqual(myElement.tagName, `H3`)
        assert.doesNotThrow(() => {
          click(myElement)
        })
      })
  })

  describe(`DOM.select()`, () => {
    it(`should be an object with observable and events()`, done => {
      function app() {
        return {
          DOM: most.just(div([h3(`.myelementclass`, `Foobar`)])),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      // Make assertions
      const selection = sources.DOM.select(`.myelementclass`)
      assert.strictEqual(typeof selection, `object`)
      assert.strictEqual(typeof selection.observable, `object`)
      assert.strictEqual(typeof selection.observable.observe, `function`)
      assert.strictEqual(typeof selection.events, `function`)

      done()
    })

    it(`should have an observable of DOM elements`, done => {
      function app() {
        return {
          DOM: most.just(h3(`.myelementclass`, `Foobar`)),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      // Make assertions
      sources.DOM.select(`.myelementclass`).observable
        .observe(elements => {
          assert.notStrictEqual(elements, null)
          assert.notStrictEqual(typeof elements, `undefined`)
          // Is an Array
          assert.strictEqual(Array.isArray(elements), true)
          assert.strictEqual(elements.length, 1)
          // Array with the H3 element
          assert.strictEqual(elements[0].tagName, `H3`)
          assert.strictEqual(elements[0].textContent, `Foobar`)

          done()
        })
    })

    it(`should not select element outside the given scope`, done => {
      function app() {
        return {
          DOM: most.just(
            h3(`.top-most`, [
              h2(`.bar`, `Wrong`),
              div(`.foo`, [
                h4(`.bar`, `Correct`),
              ]),
            ])
          ),
        }
      }
      let {sources} = run(app, {
        DOM: makeDOMDriver(createRenderTarget()),
      })
      // Make assertions
      sources.DOM.select(`.foo`).select(`.bar`).observable
        .observe(elements => {
          assert.strictEqual(elements.length, 1)
          let element = elements[0]
          assert.notStrictEqual(element, null)
          assert.notStrictEqual(typeof element, `undefined`)
          assert.strictEqual(element.tagName, `H4`)
          assert.strictEqual(element.textContent, `Correct`)

          done()
        })
    })
  })
})
