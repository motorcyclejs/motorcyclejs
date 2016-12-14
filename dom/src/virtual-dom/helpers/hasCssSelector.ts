import { VNode } from '../../types';
import { parseSelector } from './h';

export function hasCssSelector(cssSelector: string, vNode: VNode): boolean {
  if (cssSelector.indexOf(' ') > -1)
    throw new Error('CSS selectors can not contain spaces');

  const hasTagName = cssSelector[0] !== '#' && cssSelector[0] !== '.';

  const { tagName, className, id } =
    hasTagName ?
      parseSelector(cssSelector) :
      parseSelector(vNode.tagName + cssSelector);

  if (tagName !== vNode.tagName)
    return false;

  const parsedClassNames = className && className.split(' ') || [];
  const vNodeClassNames = vNode.className && vNode.className.split(' ') || [];

  for (let i = 0; i < parsedClassNames.length; ++i) {
    const parsedClassName = parsedClassNames[i];

    if (vNodeClassNames.indexOf(parsedClassName) === -1)
      return false;
  }

  return id === vNode.id;
}
