import {join} from 'path';
import {unlink} from 'fs';
import type {JestEnvironmentConfig} from '@jest/environment';

const debug = require('debug')('jest-mongodb:teardown');

module.exports = async function (config: JestEnvironmentConfig['globalConfig']) {
  const projects = config.projects.length ? config.projects : [config.rootDir];
  const globalConfigPaths = projects.map(project => join(project, 'globalConfig.json'));

  debug('Teardown mongod');
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }

  for (const path of globalConfigPaths) {
    unlink(path, err => {
      if (err) {
        debug('Config could not be deleted');

        return;
      }
      debug('Config is deleted');
    });
  }
};
