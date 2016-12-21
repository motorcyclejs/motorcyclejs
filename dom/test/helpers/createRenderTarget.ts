export function createRenderTarget (id: string | null = null) {
  let element = document.createElement('div');
  element.className = 'cycletest';

  if (id)
    element.id = id;

  document.body.appendChild(element);
  return element;
}
