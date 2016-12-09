import { VNodeData, VNodeChildren, VirtualNode, SvgTagNames } from '../../types';
import { h } from './h';

export interface SvgHyperscriptHelperFn<T extends SVGElement> {
  (): VirtualNode<T>;
  (classNameOrId: string, data: VNodeData, children: VNodeChildren): VirtualNode<T>;
  (classNameOrId: string, data: VNodeData): VirtualNode<T>;
  (classNameOrId: string, children: VNodeChildren): VirtualNode<T>;
  (classNameOrId: string): VirtualNode<T>;
  (data: VNodeData): VirtualNode<T>;
  (data: VNodeData, children: VNodeChildren): VirtualNode<T>;
  (children: VNodeChildren): VirtualNode<T>;
}

function hh <T extends SVGElement>(tagName: SvgTagNames): SvgHyperscriptHelperFn<T> {
  return function (): VirtualNode<T> {
    const selector = arguments[0];
    const data = arguments[1];
    const children = arguments[2];

    if (isSelector(selector))
      if (Array.isArray(data))
        return h(tagName + selector, {}, data);
      else if (typeof data === 'object')
        return h(tagName + selector, data, children);
      else
        return h(tagName + selector, {});

    if (Array.isArray(selector))
      return h(tagName, {}, selector);
    else if (typeof selector === 'object')
      return h(tagName, selector, data);
    else
      return h(tagName, {});
  };
};


function isValidString (param: any): boolean {
  return typeof param === 'string' && param.length > 0;
}

function isSelector (param: any): boolean {
  return isValidString(param) && (param[0] === '.' || param[0] === '#');
}

export interface SVGHelperFn extends SvgHyperscriptHelperFn<SVGElement> {
  a: SvgHyperscriptHelperFn<SVGElement>;
  altGlyph: SvgHyperscriptHelperFn<SVGElement>;
  altGlyphDef: SvgHyperscriptHelperFn<SVGElement>;
  altGlyphItem: SvgHyperscriptHelperFn<SVGElement>;
  animate: SvgHyperscriptHelperFn<SVGElement>;
  animateColor: SvgHyperscriptHelperFn<SVGElement>;
  animateMotion: SvgHyperscriptHelperFn<SVGElement>;
  animateTransform: SvgHyperscriptHelperFn<SVGElement>;
  circle: SvgHyperscriptHelperFn<SVGElement>;
  clipPath: SvgHyperscriptHelperFn<SVGElement>;
  colorProfile: SvgHyperscriptHelperFn<SVGElement>;
  cursor: SvgHyperscriptHelperFn<SVGElement>;
  defs: SvgHyperscriptHelperFn<SVGElement>;
  desc: SvgHyperscriptHelperFn<SVGElement>;
  ellipse: SvgHyperscriptHelperFn<SVGElement>;
  feBlend: SvgHyperscriptHelperFn<SVGElement>;
  feColorMatrix: SvgHyperscriptHelperFn<SVGElement>;
  feComponentTransfer: SvgHyperscriptHelperFn<SVGElement>;
  feComposite: SvgHyperscriptHelperFn<SVGElement>;
  feConvolveMatrix: SvgHyperscriptHelperFn<SVGElement>;
  feDiffuseLighting: SvgHyperscriptHelperFn<SVGElement>;
  feDisplacementMap: SvgHyperscriptHelperFn<SVGElement>;
  feDistantLight: SvgHyperscriptHelperFn<SVGElement>;
  feFlood: SvgHyperscriptHelperFn<SVGElement>;
  feFuncA: SvgHyperscriptHelperFn<SVGElement>;
  feFuncB: SvgHyperscriptHelperFn<SVGElement>;
  feFuncG: SvgHyperscriptHelperFn<SVGElement>;
  feFuncR: SvgHyperscriptHelperFn<SVGElement>;
  feGaussianBlur: SvgHyperscriptHelperFn<SVGElement>;
  feImage: SvgHyperscriptHelperFn<SVGElement>;
  feMerge: SvgHyperscriptHelperFn<SVGElement>;
  feMergeNode: SvgHyperscriptHelperFn<SVGElement>;
  feMorphology: SvgHyperscriptHelperFn<SVGElement>;
  feOffset: SvgHyperscriptHelperFn<SVGElement>;
  fePointLight: SvgHyperscriptHelperFn<SVGElement>;
  feSpecularLighting: SvgHyperscriptHelperFn<SVGElement>;
  feSpotlight: SvgHyperscriptHelperFn<SVGElement>;
  feTile: SvgHyperscriptHelperFn<SVGElement>;
  feTurbulence: SvgHyperscriptHelperFn<SVGElement>;
  filter: SvgHyperscriptHelperFn<SVGElement>;
  font: SvgHyperscriptHelperFn<SVGElement>;
  fontFace: SvgHyperscriptHelperFn<SVGElement>;
  fontFaceFormat: SvgHyperscriptHelperFn<SVGElement>;
  fontFaceName: SvgHyperscriptHelperFn<SVGElement>;
  fontFaceSrc: SvgHyperscriptHelperFn<SVGElement>;
  fontFaceUri: SvgHyperscriptHelperFn<SVGElement>;
  foreignObject: SvgHyperscriptHelperFn<SVGElement>;
  g: SvgHyperscriptHelperFn<SVGElement>;
  glyph: SvgHyperscriptHelperFn<SVGElement>;
  glyphRef: SvgHyperscriptHelperFn<SVGElement>;
  hkern: SvgHyperscriptHelperFn<SVGElement>;
  image: SvgHyperscriptHelperFn<SVGElement>;
  line: SvgHyperscriptHelperFn<SVGElement>;
  linearGradient: SvgHyperscriptHelperFn<SVGElement>;
  marker: SvgHyperscriptHelperFn<SVGElement>;
  mask: SvgHyperscriptHelperFn<SVGElement>;
  metadata: SvgHyperscriptHelperFn<SVGElement>;
  missingGlyph: SvgHyperscriptHelperFn<SVGElement>;
  mpath: SvgHyperscriptHelperFn<SVGElement>;
  path: SvgHyperscriptHelperFn<SVGElement>;
  pattern: SvgHyperscriptHelperFn<SVGElement>;
  polygon: SvgHyperscriptHelperFn<SVGElement>;
  polyline: SvgHyperscriptHelperFn<SVGElement>;
  radialGradient: SvgHyperscriptHelperFn<SVGElement>;
  rect: SvgHyperscriptHelperFn<SVGElement>;
  script: SvgHyperscriptHelperFn<SVGElement>;
  set: SvgHyperscriptHelperFn<SVGElement>;
  stop: SvgHyperscriptHelperFn<SVGElement>;
  style: SvgHyperscriptHelperFn<SVGElement>;
  switch: SvgHyperscriptHelperFn<SVGElement>;
  symbol: SvgHyperscriptHelperFn<SVGElement>;
  text: SvgHyperscriptHelperFn<SVGElement>;
  textPath: SvgHyperscriptHelperFn<SVGElement>;
  title: SvgHyperscriptHelperFn<SVGElement>;
  tref: SvgHyperscriptHelperFn<SVGElement>;
  tspan: SvgHyperscriptHelperFn<SVGElement>;
  use: SvgHyperscriptHelperFn<SVGElement>;
  view: SvgHyperscriptHelperFn<SVGElement>;
  vkern: SvgHyperscriptHelperFn<SVGElement>;
}

function createSVGHelper (): SVGHelperFn {
  let svg: any = hh('svg');

  svg.a = hh('a');
  svg.altGlyph = hh('altGlyph');
  svg.altGlyphDef = hh('altGlyphDef');
  svg.altGlyphItem = hh('altGlyphItem');
  svg.animate = hh('animate');
  svg.animateColor = hh('animateColor');
  svg.animateMotion = hh('animateMotion');
  svg.animateTransform = hh('animateTransform');
  svg.circle = hh('circle');
  svg.clipPath = hh('clipPath');
  svg.colorProfile = hh('colorProfile');
  svg.cursor = hh('cursor');
  svg.defs = hh('defs');
  svg.desc = hh('desc');
  svg.ellipse = hh('ellipse');
  svg.feBlend = hh('feBlend');
  svg.feColorMatrix = hh('feColorMatrix');
  svg.feComponentTransfer = hh('feComponentTransfer');
  svg.feComposite = hh('feComposite');
  svg.feConvolveMatrix = hh('feConvolveMatrix');
  svg.feDiffuseLighting = hh('feDiffuseLighting');
  svg.feDisplacementMap = hh('feDisplacementMap');
  svg.feDistantLight = hh('feDistantLight');
  svg.feFlood = hh('feFlood');
  svg.feFuncA = hh('feFuncA');
  svg.feFuncB = hh('feFuncB');
  svg.feFuncG = hh('feFuncG');
  svg.feFuncR = hh('feFuncR');
  svg.feGaussianBlur = hh('feGaussianBlur');
  svg.feImage = hh('feImage');
  svg.feMerge = hh('feMerge');
  svg.feMergeNode = hh('feMergeNode');
  svg.feMorphology = hh('feMorphology');
  svg.feOffset = hh('feOffset');
  svg.fePointLight = hh('fePointLight');
  svg.feSpecularLighting = hh('feSpecularLighting');
  svg.feSpotlight = hh('feSpotlight');
  svg.feTile = hh('feTile');
  svg.feTurbulence = hh('feTurbulence');
  svg.filter = hh('filter');
  svg.font = hh('font');
  svg.fontFace = hh('fontFace');
  svg.fontFaceFormat = hh('fontFaceFormat');
  svg.fontFaceName = hh('fontFaceName');
  svg.fontFaceSrc = hh('fontFaceSrc');
  svg.fontFaceUri = hh('fontFaceUri');
  svg.foreignObject = hh('foreignObject');
  svg.g = hh('g');
  svg.glyph = hh('glyph');
  svg.glyphRef = hh('glyphRef');
  svg.hkern = hh('hkern');
  svg.image = hh('image');
  svg.linearGradient = hh('linearGradient');
  svg.marker = hh('marker');
  svg.mask = hh('mask');
  svg.metadata = hh('metadata');
  svg.missingGlyph = hh('missingGlyph');
  svg.mpath = hh('mpath');
  svg.path = hh('path');
  svg.pattern = hh('pattern');
  svg.polygon = hh('polygon');
  svg.polyline = hh('polyline');
  svg.radialGradient = hh('radialGradient');
  svg.rect = hh('rect');
  svg.script = hh('script');
  svg.set = hh('set');
  svg.stop = hh('stop');
  svg.style = hh('style');
  svg.switch = hh('switch');
  svg.symbol = hh('symbol');
  svg.text = hh('text');
  svg.textPath = hh('textPath');
  svg.title = hh('title');
  svg.tref = hh('tref');
  svg.tspan = hh('tspan');
  svg.use = hh('use');
  svg.view = hh('view');
  svg.vkern = hh('vkern');

  return svg as SVGHelperFn;
}

export const svg: SVGHelperFn = createSVGHelper();