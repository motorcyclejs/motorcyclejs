import { Stream, map, switchLatest, startWith } from 'most';
import { create } from '@most/create';
import * as i18n from 'i18next';

export type I18nSource =
  (key: string, translationOptions?: i18n.TranslationOptions) => Stream<string>;

const defaultLanguage = 'en-US';
const userLanguage = navigator.language || (navigator as any).userLanguage || defaultLanguage;

export function makeI18nDriver(options?: i18n.Options) {
  i18n.init(options);

  return function i18nDriver(sink$: Stream<string>): I18nSource {
    const translation$: Stream<i18n.TranslationFunction> =
      switchLatest(map(createTranslationStream, startWith(userLanguage, sink$)));

    return function i18nSource(key: string, translationOptions?: i18n.TranslationOptions) {
      return map(t => t(key, translationOptions), translation$);
    };
  };
}

function createTranslationStream(language: string): Stream<i18n.TranslationFunction> {
  return create<i18n.TranslationFunction>((add, _, error) => {
    i18n.changeLanguage(language, function (err: any, t: i18n.TranslationFunction) {
      if (err) error(err);

      add(t);
    });
  });
}
