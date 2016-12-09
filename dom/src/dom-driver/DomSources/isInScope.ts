export function isInScope(scope: string) {
  return function (element: HTMLElement) {
    const isolate = element.getAttribute('data-isolate');

    if (scope)
      return isolate === scope;

    return !isolate;
  };
}
