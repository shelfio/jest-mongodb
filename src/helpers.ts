import {resolve} from 'path';

const cwd = process.cwd();
const configFile = process.env.MONGO_MEMORY_SERVER_FILE || 'jest-mongodb-config.js';

export function getMongodbMemoryOptions() {
  try {
    const {mongodbMemoryServerOptions} = require(resolve(cwd, configFile));

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

export function getMongoURLEnvName() {
  try {
    const {mongoURLEnvName} = require(resolve(cwd, configFile));

    return mongoURLEnvName || 'MONGO_URL';
  } catch (e) {
    return 'MONGO_URL';
  }
}

export function shouldUseSharedDBForAllJestWorkers() {
  try {
    const {useSharedDBForAllJestWorkers} = require(resolve(cwd, configFile));

    if (typeof useSharedDBForAllJestWorkers === 'undefined') {
      return true;
    }

    return useSharedDBForAllJestWorkers;
  } catch (e) {
    return true;
  }
}
