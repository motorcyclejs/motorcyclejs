import { SnabbdomAPI } from '../types';

export function createElement(tagName: string): Element {
  return document.createElement(tagName);
}

export function createElementNS(namespaceURI: string, qualifiedName: string): Element {
  return document.createElementNS(namespaceURI, qualifiedName);
}

export function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

export function insertBefore(
  parentNode: Element | Text,
  newNode: Element | Text,
  referenceNode: Element | Text | null): void
{
  parentNode.insertBefore(newNode, referenceNode);
}

export function removeChild(node: Element | Text, child: Element | Text): void {
  if (node === void 0) { return; }
  node.removeChild(child);
}

export function appendChild(node: Element, child: Element | Text): void {
  node.appendChild(child);
}

export function parentNode(node: Element | Text): Element | Text {
  return node.parentElement as Element | Text;
}

export function nextSibling(node: Element | Text): Node | Element {
  return node.nextSibling as Node | Element;
}

export function tagName(node: Element | Text): string {
  return (node as Element).tagName || '';
}

export function setTextContent(node: Element | Text, text: string): void {
  node.textContent = text;
}

const HTMLDOMAPI: SnabbdomAPI<Element, Text, Node> = {
  createElement,
  createElementNS,
  createTextNode,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
};

export default HTMLDOMAPI;
