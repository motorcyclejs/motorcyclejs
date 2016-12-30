import { Stream, just } from 'most';

export function makeI18nDriver() {
  return function i18nDriver(language$: Stream<string>) {
    Function.prototype(language$);

    return function i18Source(key: string): Stream<any> {
      return just(key);
    };
  };
}
