import {h} from './h'

function init (thunk) {
  let cur = thunk.data
  cur.vnode = cur.fn.apply(undefined, cur.args)
}

function prepatch (oldThunk, thunk) { // eslint-disable-line complexity
  let old = oldThunk.data
  let cur = thunk.data
  let oldArgs = old.args
  let args = cur.args
  cur.vnode = old.vnode

  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    cur.vnode = cur.fn.apply(undefined, args)
    return
  }
  for (let i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      cur.vnode = cur.fn.apply(undefined, args)
      return
    }
  }
}

export function thunk (name, fn, ...args) {
  return h('thunk' + name, {
    hook: {init, prepatch},
    fn, args
  })
}
