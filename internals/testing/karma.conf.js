module.exports = function(config) {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],

    files: [
      'app/**/*.test.js'
    ],

    preprocessors: {
      '**/*.test.js': ['webpack', 'sourcemap']
    },

    webpack: Object.assign(
      {}, require('../../webpack.config.js'),
      { devtool: 'inline-source-map' }),

    reporters: ['progress'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,
    concurrency: Infinity
  });
};

