function updateDataset (oldVNode, vNode) { // eslint-disable-line complexity
  const elm = vNode.elm
  const oldDataset = oldVNode.data.dataset || {}
  const dataset = vNode.data.dataset || {}
  let key

  for (key in oldDataset) {
    if (!dataset[key]) {
      delete elm.dataset[key]
    }
  }
  for (key in dataset) {
    if (oldDataset[key] !== dataset[key]) {
      elm.dataset[key] = dataset[key]
    }
  }
}

const DatasetModule = {
  create: updateDataset,
  update: updateDataset
}

export {DatasetModule}
