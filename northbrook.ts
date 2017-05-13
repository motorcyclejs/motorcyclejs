import { NorthbrookConfig } from 'northbrook'
import { plugin as mocha } from '@northbrook/mocha'
import { plugin as northbrook } from 'northbrook/plugins'
import { plugin as tsc } from '@northbrook/tsc'
import { plugin as tslint } from '@northbrook/tslint'

const config: NorthbrookConfig =
  {
    packages: [
      'stream',
      'dom',
      'history',
      'router',
      'run',
      'i18n',
      'local-storage',
      'session-storage',
      'http',
    ],

    plugins: [
      northbrook,
      mocha,
      tsc,
      tslint,
      '.plugins/karma.ts',
      '.plugins/create.ts',
    ],

    mocha: {
      exclude: [
        '@motorcycle/dom',
        '@motorcycle/local-storage',
        '@motorcycle/session-storage',
        '@motorcycle/http',
      ],
    },

    tsc: {
      es2015: true,
      patterns: [
        'src/**/*.ts',
      ],
    },

    tslint: {
      patterns: [
        'src/**/*.ts',
      ],
    },
  }

export = config
