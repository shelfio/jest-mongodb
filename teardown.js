const debug = require('debug')('jest-mongodb:teardown');
const {join} = require('path');
const fs = require('fs');

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = async function () {
  debug('Teardown mongod');
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
  fs.unlink(globalConfigPath, err => {
    if (err) {
      debug('Config could not be deleted');

      return;
    }
    debug('Config is deleted');
  });
};
