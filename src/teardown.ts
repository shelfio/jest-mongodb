import {join} from 'path';
import {unlink} from 'fs';

const debug = require('debug')('jest-mongodb:teardown');

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = async function () {
  debug('Teardown mongod');
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
  unlink(globalConfigPath, err => {
    if (err) {
      debug('Config could not be deleted');

      return;
    }
    debug('Config is deleted');
  });
};
