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

const vTreeParser =
  vTree => {
    if (!vTree) {
      return null
    } else if (vTree.observe) {
      return vTree.flatMap(vTreeParser)
    } else if (`object` === typeof vTree) {
      const vTree$ = most.just(vTree)
      if (vTree.children && vTree.children.length > 0) {
        return most.combine(
          combineVTreeStreams,
          vTree$,
          ...filter(
            map(vTree.children, vTreeParser),
            x => x !== null
          )
        )
      }
      return vTree$
    } else {
      throw new Error(`Unhandled tree value`)
    }
  }

export default vTreeParser
