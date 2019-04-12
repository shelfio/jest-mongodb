const {resolve} = require('path');

module.exports = {
  globalSetup: resolve(__dirname, './setup.js'),
  globalTeardown: resolve(__dirname, './teardown.js'),
  testEnvironment: resolve(__dirname, './environment.js')
};
