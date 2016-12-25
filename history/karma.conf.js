module.exports = function (config) {
  const configuration =
    {
      files: [
        'test/browser/bundle.js'
      ],

      frameworks: [
        'mocha'
      ],

      customLaunchers: {
        Chrome_travis_ci: {
          base: 'Chrome',
          flags: ['--no-sandbox']
        }
      },

      browsers: [
        'Chrome',
      ],
    }

  if (process.env.TRAVIS)
    configuration.browsers = ['Chrome_travis_ci'];

  config.set(configuration);
}