import {resolve} from 'path';
import {Config} from './types';

const configFile = process.env.MONGO_MEMORY_SERVER_FILE || 'jest-mongodb-config.js';

export function getMongodbMemoryOptions(cwd: string) {
  try {
    const {mongodbMemoryServerOptions}: Config = require(resolve(cwd, configFile));

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {},
    };
  }
}

export function getMongoURLEnvName(cwd: string) {
  try {
    const {mongoURLEnvName}: Config = require(resolve(cwd, configFile));

    return mongoURLEnvName || 'MONGO_URL';
  } catch (e) {
    return 'MONGO_URL';
  }
}

export function shouldUseSharedDBForAllJestWorkers(cwd: string) {
  try {
    const {useSharedDBForAllJestWorkers}: Config = require(resolve(cwd, configFile));

    if (typeof useSharedDBForAllJestWorkers === 'undefined') {
      return true;
    }

    return useSharedDBForAllJestWorkers;
  } catch (e) {
    return true;
  }
}
