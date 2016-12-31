import * as i18next from 'i18next';

import { Stream, map, startWith } from 'most';

import { sync } from 'most-subject';

export type I18nSource =
  (key: string, translationOptions?: i18next.TranslationOptions) => Stream<string>;

export function makeI18nDriver(plugins: Array<any> = [], options?: i18next.Options) {

  return function i18nDriver(sink$: Stream<string>): I18nSource {

    const translationFn$ = sync<i18next.TranslationFunction>();

    plugins
      .reduce((i18n, plugin) => i18n.use(plugin), i18next)
      .init(options, function () {
        sink$.observe((language: string) => {
          i18next.changeLanguage(language, function (err: any, t: i18next.TranslationFunction) {
            if (err)
              return translationFn$.error(err);

            translationFn$.next(t);
          });
        });
      });

    return function i18nSource(key: string, translationOptions?: i18next.TranslationOptions) {
      return map(t => t(key, translationOptions), translationFn$);
    };
  };
}
