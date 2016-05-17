import {h} from './h'

function isValidString (param) {
  return typeof param === 'string' && param.length > 0
}

function isSelector (param) {
  return isValidString(param) && (param[0] === '.' || param[0] === '#')
}

function createTagFunction (tagName) {
  return function hyperscript (first, b, c) { // eslint-disable-line complexity
    if (isSelector(first)) {
      if (!!b && !!c) {
        return h(tagName + first, b, c)
      } else if (!!b) { // eslint-disable-line no-extra-boolean-cast
        return h(tagName + first, b)
      } else {
        return h(tagName + first, {})
      }
    } else if (!!b) { // eslint-disable-line no-extra-boolean-cast
      return h(tagName, first, b)
    } else if (!!first) { // eslint-disable-line no-extra-boolean-cast
      return h(tagName, first)
    } else {
      return h(tagName, {})
    }
  }
}

const SVG_TAG_NAMES = [
  'a', 'altGlyph', 'altGlyphDef', 'altGlyphItem', 'animate', 'animateColor',
  'animateMotion', 'animateTransform', 'animateTransform', 'circle', 'clipPath',
  'colorProfile', 'cursor', 'defs', 'desc', 'ellipse', 'feBlend', 'feColorMatrix',
  'feComponentTransfer', 'feComposite', 'feConvolveMatrix', 'feDiffuseLighting',
  'feDisplacementMap', 'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB',
  'feFuncG', 'feFuncR', 'feGaussianBlur', 'feImage', 'feMerge', 'feMergeNode',
  'feMorphology', 'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotlight',
  'feTile', 'feTurbulence', 'filter', 'font', 'fontFace', 'fontFaceFormat',
  'fontFaceName', 'fontFaceSrc', 'fontFaceUri', 'foreignObject', 'g',
  'glyph', 'glyphRef', 'hkern', 'image', 'line', 'linearGradient', 'marker',
  'mask', 'metadata', 'missingGlyph', 'mpath', 'path', 'pattern', 'polygon',
  'polyling', 'radialGradient', 'rect', 'script', 'set', 'stop', 'style',
  'switch', 'symbol', 'text', 'textPath', 'title', 'tref', 'tspan', 'use',
  'view', 'vkern'
]

const svg = createTagFunction('svg')

SVG_TAG_NAMES.forEach(tag => {
  svg[tag] = createTagFunction(tag)
})

const TAG_NAMES = [
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base',
  'bdi', 'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption',
  'cite', 'code', 'col', 'colgroup', 'dd', 'del', 'dfn', 'dir', 'div', 'dl',
  'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer', 'form',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr', 'html',
  'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend',
  'li', 'link', 'main', 'map', 'mark', 'menu', 'meta', 'nav', 'noscript',
  'object', 'ol', 'optgroup', 'option', 'p', 'param', 'pre', 'q', 'rp', 'rt',
  'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span',
  'strong', 'style', 'sub', 'sup', 'table', 'tbody', 'td', 'textarea',
  'tfoot', 'th', 'thead', 'title', 'tr', 'u', 'ul', 'video', 'progress'
]

const exported = {
  SVG_TAG_NAMES,
  TAG_NAMES,
  svg,
  isSelector,
  createTagFunction
}

for (let i = 0; i < TAG_NAMES.length; ++i) {
  exported[TAG_NAMES[i]] = createTagFunction(TAG_NAMES[i])
}

export default exported
