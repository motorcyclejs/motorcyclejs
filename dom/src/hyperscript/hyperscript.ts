import { VNode, VNodeData } from 'snabbdom-ts';

import { HyperscriptFn } from 'snabbdom-ts/h';

function addNS(data: VNodeData, children: Array<VNode | string | null>, selector: string): void {
  data.ns = `http://www.w3.org/2000/svg`;
  if (selector !== `foreignObject` && typeof children !== `undefined` && Array.isArray(children)) {
    for (let i = 0; i < children.length; ++i) {
      addNS((children[i] as VNode).data as VNodeData,
            (children[i] as VNode).children as Array<VNode | string>,
            (children[i] as VNode).sel as string);
    }
  }
}

export const h: HyperscriptFn = <HyperscriptFn>function (selector: string, b?: any, c?: any): VNode {
  let data: VNodeData = {}
  let children: Array<VNode | string | null | undefined> = c;
  let text: string | undefined
  let i: number

  if (arguments.length === 3) {
    data = b
    if (Array.isArray(c)) {
      children = c
    } else if (typeof c === 'string' || typeof c === 'number') {
      text = String(c)
    }
  } else if (arguments.length === 2) {
    if (Array.isArray(b)) {
      children = b
    } else if (typeof b === 'string' || typeof b === 'number') {
      text = String(b)
    } else {
      data = b
    }
  }

  const classNames = findClassNames(selector);

  if (classNames) {
    selector = selector.replace('.' + classNames, '');

    const classes: any = data.class || {};
    classNames.split('.').forEach((className: string) => {
      classes[className] = true;
    })

    data.class = classes;
  }

  if (Array.isArray(children)) {
    children = children.filter(Boolean)
    for (i = 0; i < children.length; ++i) {
      if (typeof children[i] === 'string' || typeof children[i] === 'number') {
        children[i] = MotorcycleVNode.createTextVNode(String(children[i]) as string)
      }
    }
  }

  if (selector[0] === 's' && selector[1] === 'v' && selector[2] === 'g') {
    addNS(data, children as Array<VNode | string | null>, selector)
  }

  return MotorcycleVNode.create(selector, data, children as any, text, undefined, data && data.key)
}

export class MotorcycleVNode implements VNode {
  constructor(public sel: string | undefined,
              public data: VNodeData | undefined,
              public children: Array<string | VNode> | undefined,
              public text: string | undefined,
              public elm: HTMLElement | Text | undefined,
              public key: string | number | undefined) { }

  static create(sel: string,
                data: VNodeData,
                children: Array<string | VNode> | undefined,
                text: string | undefined,
                elm: HTMLElement | Text | undefined,
                key: string | number | undefined): MotorcycleVNode {
    return new MotorcycleVNode(sel, data, children, text, elm, key)
  }

  static createTextVNode(text: string): MotorcycleVNode {
    return new MotorcycleVNode(undefined, undefined, undefined, text, undefined, undefined)
  }
}

function findClassNames(selector: string) {
  const hashIndex = selector.indexOf('#');
  const dotIndex = selector.indexOf('.', hashIndex);
  const firstClassNamePosition = dotIndex > 0 ? dotIndex : selector.length;

  if (!dotIndex) return null

  return selector.slice(firstClassNamePosition + 1);
}