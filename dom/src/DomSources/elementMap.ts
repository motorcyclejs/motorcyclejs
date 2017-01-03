const noop = () => void 0;
const always = (x: any) => () => x;

export const elementMap = new Map<string, any>([
  ['document', documentElement()],
  ['body', bodyElement()],
  ['window', windowElement()],
]);

const fallback: any =
  {
    matches: always(true),
    addEventListener: noop,
    removeEventListener: noop,
  };

function documentElement(): Document {
  try {
    return document;
  } catch (e) {
    return fallback as Document;
  }
}

function bodyElement(): HTMLBodyElement {
  try {
    return document && document.body as HTMLBodyElement;
  } catch (e) {
    return fallback as HTMLBodyElement;
  }
}

function windowElement(): Window {
  try {
    return window;
  } catch (e) {
    return fallback as Window;
  }
}