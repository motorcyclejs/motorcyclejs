module.exports = function (config) {
  const configuration =
    {
      files: [
        'test/bundle.js'
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
        'Firefox',
        'Chrome',
      ],
    }

  if (process.env.TRAVIS)
    configuration.browsers = ['Chrome_travis_ci', 'Firefox'];

  config.set(configuration);
}
