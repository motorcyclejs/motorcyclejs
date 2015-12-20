import h from 'snabbdom/h'
import thunk from 'snabbdom/thunk'
const hh = require(`hyperscript-helpers`)(h)
import makeDomDriver from './makeDomDriver'

import assign from 'fast.js/object/assign'

module.exports = assign({makeDomDriver, h, thunk}, hh)
