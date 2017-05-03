import { eq } from '@briancavalier/assert'
import { fromArray } from '../sources'
import { last } from './last'
import { observe } from './observe'

describe('last', () => {
  it('plays the last value before ending', () =>
    observe(eq(3), last(fromArray([1, 2, 3]))),
  )
})
