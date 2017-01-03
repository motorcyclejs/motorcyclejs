import { SCOPE_ATTRIBUTE } from 'mostly-dom';

export function isInScope(scope: string) {
  return function (element: HTMLElement) {
    const isolate = element.getAttribute(SCOPE_ATTRIBUTE);

    if (scope)
      return isolate === scope;

    return !isolate;
  };
}
