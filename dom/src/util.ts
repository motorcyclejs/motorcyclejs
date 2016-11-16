import { VNode, VNodeData } from './interfaces'

function isElement (obj: any) {
  return typeof HTMLElement === `object` ?
    obj instanceof HTMLElement || obj instanceof DocumentFragment :
    obj && typeof obj === `object` && obj !== null &&
    (obj.nodeType === 1 || obj.nodeType === 11) &&
    typeof obj.nodeName === `string`
}

export const SCOPE_PREFIX = `$$MOTORCYCLEDOM$$-`

export function getElement (selectors: Element | string): HTMLElement {
  const domElement: HTMLElement = (typeof selectors === `string`
    ? document.querySelector(<string> selectors) : selectors) as HTMLElement

  if (typeof selectors === `string` && domElement === null) {
    throw new Error(`Cannot render into unknown element \`${selectors}\``)
  } else if (!isElement(domElement)) {
    throw new Error(`Given container is not a DOM element neither a ` +
      `selector string.`)
  }
  return domElement
}

export function getScope (namespace: String[]): string {
  return namespace
    .filter(c => c.indexOf(SCOPE_PREFIX) > -1)
    .slice(-1) // only need the latest, most specific, isolated boundary
    .join(``)
}

export function getSelectors (namespace: String[]): string {
  return namespace.filter(c => c.indexOf(SCOPE_PREFIX) === -1).join(` `)
}

export function classNameFromVNode (vNode: VNode): string {
  let {className: cn} = selectorParser(vNode.sel)

  if (!vNode.data) {
    return cn
  }

  const {class: dataClass, props} = vNode.data

  if (dataClass) {
    const c = Object.keys(vNode.data.class)
      .filter(cl => (vNode.data as VNodeData).class[cl])
    cn += ` ${c.join(` `)}`
  }

  if (props && props.className) {
    cn += ` ${props.className}`
  }

  return cn.trim()
}

const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/
const notClassId = /^\.|#/

export function selectorParser (selector: string = ``) {
  let tagName: string = `div`
  let id: string = ``
  let classes: string[] = []

  let tagParts = selector.split(classIdSplit)

  if (notClassId.test(tagParts[1]) || selector === ``) {
    tagName = `div`
  }

  let part: any
  let type: string

  for (let i = 0; i < tagParts.length; i++) {
    part = tagParts[i]

    if (!part) {
      continue
    }

    type = part.charAt(0)

    if (!tagName) {
      tagName = part
    } else if (type === `.`) {
      classes.push(part.substring(1, part.length))
    } else if (type === `#`) {
      id = part.substring(1, part.length)
    }
  }

  return {
    tagName,
    id,
    className: classes.join(` `),
  }
}

function getPropotype(): any {
  try {
    return Element && Element.prototype;
  } catch (e) {
    return {}
  }
}

const proto = getPropotype();
const vendor = proto.matches
  || (proto as any).matchesSelector
  || proto.webkitMatchesSelector
  || (proto as any).mozMatchesSelector
  || proto.msMatchesSelector
  || (proto as any).oMatchesSelector;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

export function matchesSelector(element: Element, selector: string): boolean {
  if (vendor)
    return vendor.call(element, selector);

  let nodes = (element.parentNode as any).querySelectorAll(selector);

  for (let i = 0; i < nodes.length; i++)
    if (nodes[i] == element) return true;

  return false;
}