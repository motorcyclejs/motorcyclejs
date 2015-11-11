var postProcessor = require('wallabify')({});

module.exports = function(wallaby) {
  return {
    files: [
      {pattern: 'test/browser/shim/raf.js', instrument: false},
      {pattern: 'src/**/*.js', load: false}
    ],
    tests: [
      {pattern: 'test/browser/perf/index.js', ignore: true},
      {pattern: 'test/**/*.js', load: false},
    ],
    compilers: {
      '**/*.js': wallaby.compilers.babel({
        babel: require("babel-core"),
        presets: ['es2015']
      })
    },
    debug: true,
    testFramework: 'mocha',
    postprocessor: postProcessor,
    env: {
      type: 'browser'
    },
    bootstrap: function() {
      window.__moduleBundler.loadTests()
    }
  }
}
