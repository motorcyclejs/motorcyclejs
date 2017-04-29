import * as assert from 'assert'

import { DomSinks, DomSources, makeDomComponent } from './makeDomComponent'

import { MotorcycleDomSource } from './DomSources'
import { div } from 'mostly-dom'
import { isolateDom } from './isolateDom'
import { just } from 'most'
import { run } from '@motorcycle/run'

const testElement = document.createElement('div')

describe(`isolateDom`, () => {
  it(`accepts an isolation scope `, (done) => {
    const scope = `foo`

    function testComponent(sources: DomSources): DomSinks {
      const namespace = sources.dom.namespace()

      return { view$: just(div()) }
    }

    const dom = new MotorcycleDomSource(just(testElement), [])

    const isolatedComponent = isolateDom(testComponent, scope)

    isolatedComponent({ dom }).view$.observe((view) => {
      assert.ok(view.scope && view.scope.indexOf(scope) > -1)
      done()
    })
  })
})
