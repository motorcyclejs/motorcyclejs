import { VNodeData, VNodeChildren, VirtualNode, HtmlTagNames } from '../../types';
import { h } from './h';

export interface HyperscriptHelperFn<T extends Node> {
  (): VirtualNode<T>;
  (classNameOrId: string, data: VNodeData, children: VNodeChildren): VirtualNode<T>;
  (classNameOrId: string, data: VNodeData): VirtualNode<T>;
  (classNameOrId: string, children: VNodeChildren): VirtualNode<T>;
  (classNameOrId: string): VirtualNode<T>;
  (data: VNodeData): VirtualNode<T>;
  (data: VNodeData, children: VNodeChildren): VirtualNode<T>;
  (children: VNodeChildren): VirtualNode<T>;
}

export function hh <T extends Node>(tagName: HtmlTagNames): HyperscriptHelperFn<T> {
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
        return h(tagName + selector, data || {});

    if (Array.isArray(selector))
      return h(tagName, {}, selector);
    else if (typeof selector === 'object')
      return h(tagName, selector, data);
    else
      return h(tagName, selector || {});
  };
};

function isValidString (param: any): boolean {
  return typeof param === 'string' && param.length > 0;
}

function isSelector (param: any): boolean {
  return isValidString(param) && (param[0] === '.' || param[0] === '#');
}

export const a = hh<HTMLAnchorElement>('a');
export const abbr = hh('abbr');
export const acronym = hh('acronym');
export const address = hh('address');
export const applet = hh<HTMLAppletElement>('applet');
export const area = hh<HTMLAreaElement>('area');
export const article = hh('article');
export const aside = hh('aside');
export const audio = hh<HTMLAudioElement>('audio');
export const b = hh('b');
export const base = hh<HTMLBaseElement>('base');
export const basefont = hh<HTMLBaseFontElement>('basefont');
export const bdi = hh('bdi');
export const bdo = hh('bdo');
export const bgsound = hh('bgsound');
export const big = hh('big');
export const blink = hh('blink');
export const blockquote = hh('blockquote');
export const body = hh<HTMLBodyElement>('body');
export const br = hh<HTMLBRElement>('br');
export const button = hh<HTMLButtonElement>('button');
export const canvas = hh<HTMLCanvasElement>('canvas');
export const caption = hh('caption');
export const center = hh('center');
export const cite = hh('cite');
export const code = hh('code');
export const col = hh('col');
export const colgroup = hh('colgroup');
export const command = hh('command');
export const content = hh('content');
export const data = hh('data');
export const datalist = hh<HTMLDataListElement>('datalist');
export const dd = hh('dd');
export const del = hh('del');
export const details = hh('details');
export const dfn = hh('dfn');
export const dialog = hh('dialog');
export const dir = hh<HTMLDirectoryElement>('dir');
export const div = hh<HTMLDivElement>('div');
export const dl = hh('dl');
export const dt = hh('dt');
export const element = hh('element');
export const em = hh('em');
export const embed = hh('embed');
export const fieldset = hh<HTMLFieldSetElement>('fieldset');
export const figcaption = hh('figcaption');
export const figure = hh('figure');
export const font = hh<HTMLFontElement>('font');
export const footer = hh('footer');
export const form = hh<HTMLFormElement>('form');
export const frame = hh<HTMLFrameElement>('frame');
export const frameset = hh<HTMLFrameSetElement>('frameset');
export const h1 = hh<HTMLHeadingElement>('h1');
export const h2 = hh<HTMLHeadingElement>('h2');
export const h3 = hh<HTMLHeadingElement>('h3');
export const h4 = hh<HTMLHeadingElement>('h4');
export const h5 = hh<HTMLHeadingElement>('h5');
export const h6 = hh<HTMLHeadingElement>('h6');
export const head = hh('head');
export const header = hh('header');
export const hgroup = hh('hgroup');
export const hr = hh<HTMLHRElement>('hr');
export const html = hh<HTMLHtmlElement>('html');
export const img = hh<HTMLImageElement>('img');
export const input = hh<HTMLInputElement>('input');
export const ins = hh('ins');
export const isindex = hh('isindex');
export const kbd = hh('kbd');
export const keygen = hh('keygen');
export const label = hh<HTMLLabelElement>('label');
export const legend = hh('legend');
export const li = hh<HTMLLIElement>('li');
export const link = hh<HTMLLinkElement>('link');
export const listing = hh('listing');
export const main = hh('main');
export const map = hh<HTMLMapElement>('map');
export const mark = hh('mark');
export const marquee = hh<HTMLMarqueeElement>('marquee');
export const math = hh('math');
export const menu = hh<HTMLMenuElement>('menu');
export const menuitem = hh('menuitem');
export const meta = hh<HTMLMetaElement>('meta');
export const meter = hh('meter');
export const multicol = hh('multicol');
export const nav = hh('nav');
export const nextid = hh('nextid');
export const nobr = hh('nobr');
export const noembed = hh('noembed');
export const noframes = hh('noframes');
export const noscript = hh('noscript');
export const object = hh('object');
export const ol = hh('ol');
export const optgroup = hh('optgroup');
export const option = hh<HTMLOptionElement>('option');
export const output = hh('output');
export const p = hh<HTMLParagraphElement>('p');
export const param = hh<HTMLParamElement>('param');
export const picture = hh<HTMLPictureElement>('picture');
export const plaintext = hh('plaintext');
export const pre = hh('pre');
export const progress = hh<HTMLProgressElement>('progress');
export const q = hh<HTMLQuoteElement>('q');
export const rb = hh('rb');
export const rbc = hh('rbc');
export const rp = hh('rp');
export const rt = hh('rt');
export const rtc = hh('rtc');
export const ruby = hh('ruby');
export const s = hh('s');
export const samp = hh('samp');
export const script = hh<HTMLScriptElement>('script');
export const section = hh('section');
export const select = hh<HTMLSelectElement>('select');
export const shadow = hh('shadow');
export const small = hh('small');
export const source = hh<HTMLSourceElement>('source');
export const spacer = hh('spacer');
export const span = hh<HTMLSpanElement>('span');
export const strike = hh('strike');
export const strong = hh('strong');
export const style = hh('style');
export const sub = hh('sub');
export const summary = hh('summary');
export const sup = hh('sup');
export const table = hh<HTMLTableElement>('table');
export const tbody = hh('tbody');
export const td = hh('td');
export const template = hh('template');
export const textarea = hh('textarea');
export const tfoot = hh('tfoot');
export const th = hh('th');
export const tr = hh<HTMLTableRowElement>('tr');
export const track = hh('track');
export const tt = hh('tt');
export const u = hh('u');
export const ul = hh<HTMLUListElement>('ul');
export const video = hh<HTMLVideoElement>('video');
export const wbr = hh('wbr');
export const xmp = hh('xmp');