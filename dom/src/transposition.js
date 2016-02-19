import most from 'most'

function createVTree(vTree, children) {
  return {
    sel: vTree.sel,
    data: vTree.data,
    text: vTree.text,
    elm: vTree.elm,
    key: vTree.key,
    children,
  }
}

function transposeVTree(vTree) {
  if (!vTree) {
    return null
  } else if (vTree && typeof vTree.data === `object` && vTree.data.static) {
    return most.just(vTree)
  } else if (typeof vTree.observe === `function`) {
    return vTree.map(transposeVTree).switch()
  } else if (typeof vTree === `object`) {
    if (!vTree.children || vTree.children.length === 0) {
      return most.just(vTree)
    }

    const vTreeChildren = vTree.children
      .map(transposeVTree).filter(x => x !== null)

    return vTreeChildren.length === 0 ?
      most.just(createVTree(vTree, vTreeChildren)) :
      most.combineArray(
        (...children) => createVTree(vTree, children),
        vTreeChildren
      )
  } else {
    throw new Error(`Unhandled vTree Value`)
  }
}

export {transposeVTree}
