module.exports = function (config) {
  config.set({
    basePath: '../..',
    frameworks: ['jasmine'],

    files: [
      'app/**/*.test.js',
    ],

    preprocessors: {
      '**/*.test.js': ['webpack'],
    },

    webpack: require('../../webpack.config.js'),

    reporters: ['progress', 'spec'],

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,
    concurrency: Infinity,
  });
};
