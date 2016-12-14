import { VNode, VNodeData, VirtualNode } from '../../types';
import { MotorcycleVNode } from '../MotorcycleVNode';
import is from '../is';

function addNS(data: VNodeData, children: Array<VNode | string | null>, selector: string): void {
  data.ns = `http://www.w3.org/2000/svg`;
  if (selector !== `foreignObject` && typeof children !== `undefined` && is.array(children)) {
    for (let i = 0; i < children.length; ++i) {
        addNS((children[i] as VNode).data as VNodeData,
              (children[i] as VNode).children as Array<VNode | string>,
              (children[i] as VNode).tagName as string);
    }
  }
}

export interface HyperscriptFn {
  (sel: string): VNode;
  (sel: string, data: VNodeData): VNode;
  (sel: string, children: string | number | Array<string | VNode | null>): VNode;
  (sel: string, data: VNodeData, children: string | number | Array<string | VNode | null>): VNode;
  <T extends Node>(sel: string): VirtualNode<T>;
  <T extends Node>(sel: string, data: VNodeData): VirtualNode<T>;
  <T extends Node>(sel: string, children: string | number | Array<string | VNode | null>): VirtualNode<T>;
  <T extends Node>(sel: string, data: VNodeData, children: string | number | Array<string | VNode | null>): VirtualNode<T>;
}

export const h: HyperscriptFn = function (selector: string, b?: any, c?: any): VNode {
  let data: VNodeData = {};
  let children: Array<VNode | string | null> | undefined;
  let text: string | undefined;
  let i: number;

  if (arguments.length === 3) {
    data = b;
    if (is.array(c)) {
      children = c;
    } else if (is.primitive(c)) {
      text = String(c);
    }
  } else if (arguments.length === 2) {
    if (is.array(b)) {
      children = b;
    } else if (is.primitive(b)) {
      text = String(b);
    } else {
      data = b;
    }
  }

  if (is.array(children)) {
    children = children.filter(Boolean);

    for (i = 0; i < children.length; ++i) {
      if (is.primitive(children[i])) {
        children[i] = MotorcycleVNode.createTextVNode(String(children[i]) as string);
      }
    }
  }

  const { tagName, id, className } = parseSelector(selector);

  if (tagName === 'svg')
    addNS(data, children as Array<VNode | string | null>, tagName);

  return new MotorcycleVNode(
    tagName,
    className,
    id,
    data || {},
    children as Array<VNode>,
    text, undefined,
    data && data.key,
  );
};

const classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;

export function parseSelector (selector: string) {
  let tagName: string | void;
  let id = '';
  const classes: Array<string> = [];

  const tagParts = selector.split(classIdSplit);

  let part: string | void;
  let type;

  for (let i = 0; i < tagParts.length; i++) {
    part = tagParts[i];

    if (!part)
      continue;

    type = part.charAt(0);

    if (!tagName) {
      tagName = part;
    } else if (type === '.') {
      classes.push(part.substring(1, part.length));
    } else if (type === '#') {
      id = part.substring(1, part.length);
    }
  }

  return {
    tagName: tagName as string,
    id,
    className: classes.join(' '),
  };
}
