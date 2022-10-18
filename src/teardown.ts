import {join} from 'path';
import {unlink} from 'fs';
import { JestEnvironmentConfig } from '@jest/environment'

const debug = require('debug')('jest-mongodb:teardown');

module.exports = async function (config: JestEnvironmentConfig['projectConfig']) {
  const globalConfigPath = join(config.rootDir, 'globalConfig.json');

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
