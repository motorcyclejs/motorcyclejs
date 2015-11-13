import most from 'most'
import map from 'fast.js/array/map'

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
    if (vTree.observe) {
      return vTree.flatMap(parseTree)
    } else if (`object` === typeof vTree) {
      const vtree$ = most.just(vTree)
      if (vTree.children && vTree.children.length > 0) {
        return most.zip(
          combineVTreeStreams,
          vtree$,
          ...map(vTree.children, parseTree)
        )
      }
      return vtree$
    } else {
      throw new Error(`Unhandled tree value`)
    }
  }

export default parseTree
