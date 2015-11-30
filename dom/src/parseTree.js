import most from 'most'
import map from 'fast.js/array/map'
import filter from 'fast.js/array/filter'

const combineVTreeStreams =
  (vTree, ...children) => ({
    sel: vTree.sel,
    data: vTree.data,
    text: vTree.text,
    elm: vTree.elm,
    key: vTree.key,
    children,
  })

const parseTree =
  vTree => {
    if (!vTree) {
      return null
    } else if (vTree.observe) {
      return vTree.flatMap(parseTree)
    } else if (`object` === typeof vTree) {
      const vtree$ = most.just(vTree)
      if (vTree.children && vTree.children.length > 0) {
        return most.combine(
          combineVTreeStreams,
          vtree$,
          ...filter(
            map(vTree.children, parseTree),
            x => x !== null
          )
        )
      }
      return vtree$
    } else {
      throw new Error(`Unhandled tree value`)
    }
  }

export default parseTree
