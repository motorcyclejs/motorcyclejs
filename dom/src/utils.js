import most from 'most'

function isElement(obj) {
  return typeof HTMLElement === `object` ?
    obj instanceof HTMLElement || obj instanceof DocumentFragment : //DOM2
    obj && typeof obj === `object` && obj !== null &&
    (obj.nodeType === 1 || obj.nodeType === 11) &&
    typeof obj.nodeName === `string`
}

function getDomElement(_el) {
  const domElement =
    typeof _el === `string` ?
      document.querySelector(_el) : _el

  if (typeof domElement === `string` && domElement === null) {
    throw new Error(`Cannot render into unknown element \`${_el}\``)
  } else if (!isElement(domElement)) {
    throw new Error(`Given container is not a DOM element neither a ` +
      `selector string.`)
  }
  return domElement
}

function setImmediate(fn) {
  return setTimeout(fn, 0)
}

function Subject(initial = null) {
  let _add
  let _end
  let _error

  const stream = most.create((add, end, error) => {
    _add = add
    _end = end
    _error = error
    return _error
  })

  stream.push = v => setImmediate(() => {
    return typeof _add === `function` ? _add(v) : void 0
  })

  stream.end = () => setImmediate(() => {
    return typeof _end === `function` ? _end() : void 0
  })

  stream.error = e => setImmediate(() => {
    return typeof _error === `function` ? _error(e) : void 0
  })

  stream.plug = value$ => {
    let subject = Subject()
    value$.forEach(subject.push)
    subject.forEach(stream.push)
    return subject.end
  }

  if (initial !== null) {
    stream.push(initial)
  }

  return stream
}

export {getDomElement, Subject}
