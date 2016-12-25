module.exports = function (config) {
  const options =
    {
      basePath: '../',

      files: [
        'src/**/*.ts',
        'test/**/*.ts',
      ],

      frameworks: [
        'mocha',
        'karma-typescript',
      ],

      preprocessors: {
        '**/*.ts': ['karma-typescript'],
      },

      reporters: [],

      customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },

      browsers: [],

      coverageReporter: {
        type: 'lcov',
        dir: 'coverage'
      },

      karmaTypescriptConfig: {
        tsconfig: 'tsconfig.json',
        reports: {
          "html": "coverage",
          "lcovonly": "coverage",
        }
      }
    }

  if (process.env.UNIT)
    options.browsers.push('Chrome')

  if (process.env.TRAVIS) {
    options.browsers.push('Chrome_travis_ci', 'Firefox')
    options.reporters.push('coverage', 'coveralls')
  }

  if (options.browsers.length === 0)
    options.browsers.push('Chrome', 'Firefox')

  if (options.reporters.length === 0)
    options.reports.push('progress', 'karma-typescript')

  config.set(options);
}
