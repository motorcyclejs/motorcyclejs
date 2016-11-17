module.exports = function (config) {
  config.set({
    files: [
      'test/browser/bundle.js'
    ],

    frameworks: [
      'mocha'
    ],

    browsers: [
      'Chrome',
    ],
  });
}