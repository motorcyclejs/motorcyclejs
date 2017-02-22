module.exports = function (config) {
  const configuration =
    {
      files: [
        'src/**/*.ts',
      ],

      frameworks: [
        'mocha',
        'karma-typescript'
      ],

      preprocessors: {
        '**/*.ts': ['karma-typescript']
      },

      customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },

      browsers: [
        'Chrome',
      ],

      karmaTypescriptConfig: {
        tsconfig: 'tsconfig.json',
        reports: {
          "html": "coverage",
          "lcovonly": "coverage",
        }
      }
    }

  if (process.env.TRAVIS)
    configuration.browsers = ['Chrome_travis_ci'];

  config.set(configuration);
}
