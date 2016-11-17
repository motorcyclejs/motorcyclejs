module.exports = function (config) {
  const config =
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
    config.browsers = ['Chrome_travis_ci'];

  config.get(config);
}