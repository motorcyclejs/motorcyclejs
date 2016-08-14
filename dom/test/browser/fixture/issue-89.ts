import { h } from '../../../src/index'
import * as most from 'most'

export function myElement(content: any) {
  return most.of(content).map((content: any) =>
    h('h3.myelementclass', content)
  );
}

export function makeModelNumber$ () {
  return most.merge(
    most.of(123).delay(50),
    most.of(456).delay(100)
  );
}

export function viewWithContainerFn (number$: most.Stream<number>) {
  return number$.map((x: number) =>
    h('div', [
      myElement(String(x))
    ])
  );
}

export function viewWithoutContainerFn(number$: most.Stream<number>) {
  return number$.map((x: number) =>
    myElement(String(x))
  );
}
