import { plugin as mocha } from '@northbrook/mocha';
import { plugin as tsc } from '@northbrook/tsc';
import { plugin as tslint } from '@northbrook/tslint';
import { plugin as northbrook } from 'northbrook/plugins';

import { NorthbrookConfig } from 'northbrook';

const config: NorthbrookConfig =
  {
    packages: [
      'dom',
      'history',
      'router',
      'run',
      'i18n',
    ],

    plugins: [
      northbrook,
      mocha,
      tsc,
      tslint,
    ],

    tslint: {
      patterns: [
        'src/**/.ts',
      ],
    },
  };

export = config;
