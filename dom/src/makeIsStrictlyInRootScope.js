function makeIsStrictlyInRootScope(namespace) {
  const classIsForeign = (c) => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) === -1
  }
  const classIsDomestic = (c) => {
    const matched = c.match(/cycle-scope-(\S+)/)
    return matched && namespace.indexOf(`.${c}`) !== -1
  }
  return function isStrictlyInRootScope(leaf) {
    const some = Array.prototype.some
    const split = String.prototype.split
    for (let el = leaf; el; el = el.parentElement) {
      const classList = el.classList || split.call(el.className, ` `)
      if (some.call(classList, classIsDomestic)) {
        return true
      }
      if (some.call(classList, classIsForeign)) {
        return false
      }
    }
    return true
  }
}

export {makeIsStrictlyInRootScope}
