import { Stream, skip, scan, periodic } from 'most';

export const interval = (period: number) => skip(1, scan((x, y) => x + y, -1, periodic(period, 1))) as Stream<number>;

export function createRenderTarget (id: string | null = null) {
  let element = document.createElement('div');
  element.className = 'cycletest';

  if (id)
    element.id = id;

  document.body.appendChild(element);
  return element;
}
