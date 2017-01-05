import {
  I18n,
  Options,
  TranslationFunction,
  TranslationOptions,
  i18n,
} from '@typed/i18next';
import { Stream, map } from 'most';

import { sync } from 'most-subject';

export type I18nSource =
  (key: string, translationOptions?: TranslationOptions) => Stream<string>;

export function makeI18nDriver(plugins: Array<any> = [], options?: Options) {

  return function i18nDriver(sink$: Stream<string>): I18nSource {

    const translationFn$ = sync<TranslationFunction>();

    plugins
      .reduce((i18next: I18n, plugin: any) => i18next.use(plugin), i18n)
      .init(options, function () {
        sink$.observe((language: string) => {
          i18n.changeLanguage(language, function (err: any, t: TranslationFunction) {
            if (err)
              return translationFn$.error(err);

            translationFn$.next(t);
          });
        });
      });

    return function i18nSource(key: string, translationOptions?: TranslationOptions) {
      return map(t => t(key, translationOptions), translationFn$);
    };
  };
}
