import { Stream } from 'most'
import { VNode, VNodeData } from '../interfaces'

import { h } from './hyperscript'

export interface HyperscriptHelperFn {
  (): VNode
  (classNameOrId: string, data: VNodeData, children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
  (classNameOrId: string, data: VNodeData): VNode
  (classNameOrId: string, children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
  (classNameOrId: string): VNode
  (data: VNodeData): VNode
  (data: VNodeData, children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
  (children: string | number | Array<string | VNode | Stream<VNode> | null>): VNode
}

function isValidString (param: any): boolean {
  return typeof param === 'string' && param.length > 0;
}

function isSelector (param: any): boolean {
  return isValidString(param) && (param[0] === '.' || param[0] === '#');
}

export function hh (tagName: string): HyperscriptHelperFn {
  return <HyperscriptHelperFn>function (...args: any[]): VNode {
    const [ first, b, c ] = args

    if (isSelector(first)) {
      if (b !== void 0 && c !== void 0) {
        return h(tagName + first, b, c)
      } else if (b !== void 0) {
        return h(tagName + first, b)
      } else {
        return h(tagName + first, {})
      }
    } else if (!!b) {
      return h(tagName, first, b)
    } else if (!!first) {
      return h(tagName, first)
    } else {
      return h(tagName, {})
    }
  }
}

export const a: HyperscriptHelperFn = hh('a')
export const abbr: HyperscriptHelperFn = hh('abbr')
export const acronym: HyperscriptHelperFn = hh('acronym')
export const address: HyperscriptHelperFn = hh('address')
export const applet: HyperscriptHelperFn = hh('applet')
export const area: HyperscriptHelperFn = hh('area')
export const article: HyperscriptHelperFn = hh('article')
export const aside: HyperscriptHelperFn = hh('aside')
export const audio: HyperscriptHelperFn = hh('audio')
export const b: HyperscriptHelperFn = hh('b')
export const base: HyperscriptHelperFn = hh('base')
export const basefont: HyperscriptHelperFn = hh('basefont')
export const bdi: HyperscriptHelperFn = hh('bdi')
export const bdo: HyperscriptHelperFn = hh('bdo')
export const bgsound: HyperscriptHelperFn = hh('bgsound')
export const big: HyperscriptHelperFn = hh('big')
export const blink: HyperscriptHelperFn = hh('blink')
export const blockquote: HyperscriptHelperFn = hh('blockquote')
export const body: HyperscriptHelperFn = hh('body')
export const br: HyperscriptHelperFn = hh('br')
export const button: HyperscriptHelperFn = hh('button')
export const canvas: HyperscriptHelperFn = hh('canvas')
export const caption: HyperscriptHelperFn = hh('caption')
export const center: HyperscriptHelperFn = hh('center')
export const cite: HyperscriptHelperFn = hh('cite')
export const code: HyperscriptHelperFn = hh('code')
export const col: HyperscriptHelperFn = hh('col')
export const colgroup: HyperscriptHelperFn = hh('colgroup')
export const command: HyperscriptHelperFn = hh('command')
export const content: HyperscriptHelperFn = hh('content')
export const data: HyperscriptHelperFn = hh('data')
export const datalist: HyperscriptHelperFn = hh('datalist')
export const dd: HyperscriptHelperFn = hh('dd')
export const del: HyperscriptHelperFn = hh('del')
export const details: HyperscriptHelperFn = hh('details')
export const dfn: HyperscriptHelperFn = hh('dfn')
export const dialog: HyperscriptHelperFn = hh('dialog')
export const dir: HyperscriptHelperFn = hh('dir')
export const div: HyperscriptHelperFn = hh('div')
export const dl: HyperscriptHelperFn = hh('dl')
export const dt: HyperscriptHelperFn = hh('dt')
export const element: HyperscriptHelperFn = hh('element')
export const em: HyperscriptHelperFn = hh('em')
export const embed: HyperscriptHelperFn = hh('embed')
export const fieldset: HyperscriptHelperFn = hh('fieldset')
export const figcaption: HyperscriptHelperFn = hh('figcaption')
export const figure: HyperscriptHelperFn = hh('figure')
export const font: HyperscriptHelperFn = hh('font')
export const footer: HyperscriptHelperFn = hh('footer')
export const form: HyperscriptHelperFn = hh('form')
export const frame: HyperscriptHelperFn = hh('frame')
export const frameset: HyperscriptHelperFn = hh('frameset')
export const h1: HyperscriptHelperFn = hh('h1')
export const h2: HyperscriptHelperFn = hh('h2')
export const h3: HyperscriptHelperFn = hh('h3')
export const h4: HyperscriptHelperFn = hh('h4')
export const h5: HyperscriptHelperFn = hh('h5')
export const h6: HyperscriptHelperFn = hh('h6')
export const head: HyperscriptHelperFn = hh('head')
export const header: HyperscriptHelperFn = hh('header')
export const hgroup: HyperscriptHelperFn = hh('hgroup')
export const hr: HyperscriptHelperFn = hh('hr')
export const html: HyperscriptHelperFn = hh('html')
export const i: HyperscriptHelperFn = hh('i')
export const iframe: HyperscriptHelperFn = hh('iframe')
export const image: HyperscriptHelperFn = hh('image')
export const img: HyperscriptHelperFn = hh('img')
export const input: HyperscriptHelperFn = hh('input')
export const ins: HyperscriptHelperFn = hh('ins')
export const isindex: HyperscriptHelperFn = hh('isindex')
export const kbd: HyperscriptHelperFn = hh('kbd')
export const keygen: HyperscriptHelperFn = hh('keygen')
export const label: HyperscriptHelperFn = hh('label')
export const legend: HyperscriptHelperFn = hh('legend')
export const li: HyperscriptHelperFn = hh('li')
export const link: HyperscriptHelperFn = hh('link')
export const listing: HyperscriptHelperFn = hh('listing')
export const main: HyperscriptHelperFn = hh('main')
export const map: HyperscriptHelperFn = hh('map')
export const mark: HyperscriptHelperFn = hh('mark')
export const marquee: HyperscriptHelperFn = hh('marquee')
export const math: HyperscriptHelperFn = hh('math')
export const menu: HyperscriptHelperFn = hh('menu')
export const menuitem: HyperscriptHelperFn = hh('menuitem')
export const meta: HyperscriptHelperFn = hh('meta')
export const meter: HyperscriptHelperFn = hh('meter')
export const multicol: HyperscriptHelperFn = hh('multicol')
export const nav: HyperscriptHelperFn = hh('nav')
export const nextid: HyperscriptHelperFn = hh('nextid')
export const nobr: HyperscriptHelperFn = hh('nobr')
export const noembed: HyperscriptHelperFn = hh('noembed')
export const noframes: HyperscriptHelperFn = hh('noframes')
export const noscript: HyperscriptHelperFn = hh('noscript')
export const object: HyperscriptHelperFn = hh('object')
export const ol: HyperscriptHelperFn = hh('ol')
export const optgroup: HyperscriptHelperFn = hh('optgroup')
export const option: HyperscriptHelperFn = hh('option')
export const output: HyperscriptHelperFn = hh('output')
export const p: HyperscriptHelperFn = hh('p')
export const param: HyperscriptHelperFn = hh('param')
export const picture: HyperscriptHelperFn = hh('picture')
export const plaintext: HyperscriptHelperFn = hh('plaintext')
export const pre: HyperscriptHelperFn = hh('pre')
export const progress: HyperscriptHelperFn = hh('progress')
export const q: HyperscriptHelperFn = hh('q')
export const rb: HyperscriptHelperFn = hh('rb')
export const rbc: HyperscriptHelperFn = hh('rbc')
export const rp: HyperscriptHelperFn = hh('rp')
export const rt: HyperscriptHelperFn = hh('rt')
export const rtc: HyperscriptHelperFn = hh('rtc')
export const ruby: HyperscriptHelperFn = hh('ruby')
export const s: HyperscriptHelperFn = hh('s')
export const samp: HyperscriptHelperFn = hh('samp')
export const script: HyperscriptHelperFn = hh('script')
export const section: HyperscriptHelperFn = hh('section')
export const select: HyperscriptHelperFn = hh('select')
export const shadow: HyperscriptHelperFn = hh('shadow')
export const small: HyperscriptHelperFn = hh('small')
export const source: HyperscriptHelperFn = hh('source')
export const spacer: HyperscriptHelperFn = hh('spacer')
export const span: HyperscriptHelperFn = hh('span')
export const strike: HyperscriptHelperFn = hh('strike')
export const strong: HyperscriptHelperFn = hh('strong')
export const style: HyperscriptHelperFn = hh('style')
export const sub: HyperscriptHelperFn = hh('sub')
export const summary: HyperscriptHelperFn = hh('summary')
export const sup: HyperscriptHelperFn = hh('sup')
export const table: HyperscriptHelperFn = hh('table')
export const tbody: HyperscriptHelperFn = hh('tbody')
export const td: HyperscriptHelperFn = hh('td')
export const template: HyperscriptHelperFn = hh('template')
export const textarea: HyperscriptHelperFn = hh('textarea')
export const tfoot: HyperscriptHelperFn = hh('tfoot')
export const th: HyperscriptHelperFn = hh('th')
export const thead: HyperscriptHelperFn = hh('thead')
export const time: HyperscriptHelperFn = hh('time')
export const title: HyperscriptHelperFn = hh('title')
export const tr: HyperscriptHelperFn = hh('tr')
export const track: HyperscriptHelperFn = hh('track')
export const tt: HyperscriptHelperFn = hh('tt')
export const u: HyperscriptHelperFn = hh('u')
export const ul: HyperscriptHelperFn = hh('ul')
export const video: HyperscriptHelperFn = hh('video')
export const wbr: HyperscriptHelperFn = hh('wbr')
export const xmp: HyperscriptHelperFn = hh('xmp')

export interface SVGHelperFn extends HyperscriptHelperFn {
  a: HyperscriptHelperFn;
  altGlyph: HyperscriptHelperFn;
  altGlyphDef: HyperscriptHelperFn;
  altGlyphItem: HyperscriptHelperFn;
  animate: HyperscriptHelperFn;
  animateColor: HyperscriptHelperFn;
  animateMotion: HyperscriptHelperFn;
  animateTransform: HyperscriptHelperFn;
  circle: HyperscriptHelperFn;
  clipPath: HyperscriptHelperFn;
  colorProfile: HyperscriptHelperFn;
  cursor: HyperscriptHelperFn;
  defs: HyperscriptHelperFn;
  desc: HyperscriptHelperFn;
  ellipse: HyperscriptHelperFn;
  feBlend: HyperscriptHelperFn;
  feColorMatrix: HyperscriptHelperFn;
  feComponentTransfer: HyperscriptHelperFn;
  feComposite: HyperscriptHelperFn;
  feConvolveMatrix: HyperscriptHelperFn;
  feDiffuseLighting: HyperscriptHelperFn;
  feDisplacementMap: HyperscriptHelperFn;
  feDistantLight: HyperscriptHelperFn;
  feFlood: HyperscriptHelperFn;
  feFuncA: HyperscriptHelperFn;
  feFuncB: HyperscriptHelperFn;
  feFuncG: HyperscriptHelperFn;
  feFuncR: HyperscriptHelperFn;
  feGaussianBlur: HyperscriptHelperFn;
  feImage: HyperscriptHelperFn;
  feMerge: HyperscriptHelperFn;
  feMergeNode: HyperscriptHelperFn;
  feMorphology: HyperscriptHelperFn;
  feOffset: HyperscriptHelperFn;
  fePointLight: HyperscriptHelperFn;
  feSpecularLighting: HyperscriptHelperFn;
  feSpotlight: HyperscriptHelperFn;
  feTile: HyperscriptHelperFn;
  feTurbulence: HyperscriptHelperFn;
  filter: HyperscriptHelperFn;
  font: HyperscriptHelperFn;
  fontFace: HyperscriptHelperFn;
  fontFaceFormat: HyperscriptHelperFn;
  fontFaceName: HyperscriptHelperFn;
  fontFaceSrc: HyperscriptHelperFn;
  fontFaceUri: HyperscriptHelperFn;
  foreignObject: HyperscriptHelperFn;
  g: HyperscriptHelperFn;
  glyph: HyperscriptHelperFn;
  glyphRef: HyperscriptHelperFn;
  hkern: HyperscriptHelperFn;
  image: HyperscriptHelperFn;
  line: HyperscriptHelperFn;
  linearGradient: HyperscriptHelperFn;
  marker: HyperscriptHelperFn;
  mask: HyperscriptHelperFn;
  metadata: HyperscriptHelperFn;
  missingGlyph: HyperscriptHelperFn;
  mpath: HyperscriptHelperFn;
  path: HyperscriptHelperFn;
  pattern: HyperscriptHelperFn;
  polygon: HyperscriptHelperFn;
  polyline: HyperscriptHelperFn;
  radialGradient: HyperscriptHelperFn;
  rect: HyperscriptHelperFn;
  script: HyperscriptHelperFn;
  set: HyperscriptHelperFn;
  stop: HyperscriptHelperFn;
  style: HyperscriptHelperFn;
  switch: HyperscriptHelperFn;
  symbol: HyperscriptHelperFn;
  text: HyperscriptHelperFn;
  textPath: HyperscriptHelperFn;
  title: HyperscriptHelperFn;
  tref: HyperscriptHelperFn;
  tspan: HyperscriptHelperFn;
  use: HyperscriptHelperFn;
  view: HyperscriptHelperFn;
  vkern: HyperscriptHelperFn;
}

function createSVGHelper (): SVGHelperFn {
  let svg: any = hh('svg')

  svg.a = hh('a')
  svg.altGlyph = hh('altGlyph')
  svg.altGlyphDef = hh('altGlyphDef')
  svg.altGlyphItem = hh('altGlyphItem')
  svg.animate = hh('animate')
  svg.animateColor = hh('animateColor')
  svg.animateMotion = hh('animateMotion')
  svg.animateTransform = hh('animateTransform')
  svg.circle = hh('circle')
  svg.clipPath = hh('clipPath')
  svg.colorProfile = hh('colorProfile')
  svg.cursor = hh('cursor')
  svg.defs = hh('defs')
  svg.desc = hh('desc')
  svg.ellipse = hh('ellipse')
  svg.feBlend = hh('feBlend')
  svg.feColorMatrix = hh('feColorMatrix')
  svg.feComponentTransfer = hh('feComponentTransfer')
  svg.feComposite = hh('feComposite')
  svg.feConvolveMatrix = hh('feConvolveMatrix')
  svg.feDiffuseLighting = hh('feDiffuseLighting')
  svg.feDisplacementMap = hh('feDisplacementMap')
  svg.feDistantLight = hh('feDistantLight')
  svg.feFlood = hh('feFlood')
  svg.feFuncA = hh('feFuncA')
  svg.feFuncB = hh('feFuncB')
  svg.feFuncG = hh('feFuncG')
  svg.feFuncR = hh('feFuncR')
  svg.feGaussianBlur = hh('feGaussianBlur')
  svg.feImage = hh('feImage')
  svg.feMerge = hh('feMerge')
  svg.feMergeNode = hh('feMergeNode')
  svg.feMorphology = hh('feMorphology')
  svg.feOffset = hh('feOffset')
  svg.fePointLight = hh('fePointLight')
  svg.feSpecularLighting = hh('feSpecularLighting')
  svg.feSpotlight = hh('feSpotlight')
  svg.feTile = hh('feTile')
  svg.feTurbulence = hh('feTurbulence')
  svg.filter = hh('filter')
  svg.font = hh('font')
  svg.fontFace = hh('fontFace')
  svg.fontFaceFormat = hh('fontFaceFormat')
  svg.fontFaceName = hh('fontFaceName')
  svg.fontFaceSrc = hh('fontFaceSrc')
  svg.fontFaceUri = hh('fontFaceUri')
  svg.foreignObject = hh('foreignObject')
  svg.g = hh('g')
  svg.glyph = hh('glyph')
  svg.glyphRef = hh('glyphRef')
  svg.hkern = hh('hkern')
  svg.image = hh('image')
  svg.linearGradient = hh('linearGradient')
  svg.marker = hh('marker')
  svg.mask = hh('mask')
  svg.metadata = hh('metadata')
  svg.missingGlyph = hh('missingGlyph')
  svg.mpath = hh('mpath')
  svg.path = hh('path')
  svg.pattern = hh('pattern')
  svg.polygon = hh('polygon')
  svg.polyline = hh('polyline')
  svg.radialGradient = hh('radialGradient')
  svg.rect = hh('rect')
  svg.script = hh('script')
  svg.set = hh('set')
  svg.stop = hh('stop')
  svg.style = hh('style')
  svg.switch = hh('switch')
  svg.symbol = hh('symbol')
  svg.text = hh('text')
  svg.textPath = hh('textPath')
  svg.title = hh('title')
  svg.tref = hh('tref')
  svg.tspan = hh('tspan')
  svg.use = hh('use')
  svg.view = hh('view')
  svg.vkern = hh('vkern')

  return svg as SVGHelperFn
}

export const svg: SVGHelperFn = createSVGHelper()
