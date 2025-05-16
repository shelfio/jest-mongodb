import {resolve} from 'path';
import type {MongoMemoryReplSet, MongoMemoryServer} from 'mongodb-memory-server';
import type {Config} from './types';

const configFile = process.env.MONGO_MEMORY_SERVER_FILE || 'jest-mongodb-config.js';

type MongoMemoryReplSetOpts = NonNullable<ConstructorParameters<typeof MongoMemoryReplSet>[0]>;
type MongoMemoryServerOpts = NonNullable<ConstructorParameters<typeof MongoMemoryServer>[0]>;

export function isMongoMemoryReplSetOptions(
  options?: MongoMemoryReplSetOpts | MongoMemoryServerOpts
): options is MongoMemoryReplSetOpts {
  return Boolean((options as MongoMemoryReplSetOpts).replSet);
}

export function getMongodbMemoryOptions(
  cwd: string
): MongoMemoryReplSetOpts | MongoMemoryServerOpts | undefined {
  try {
    const {mongodbMemoryServerOptions}: Config = require(resolve(cwd, configFile));

    return mongodbMemoryServerOptions;
  } catch {
    return {
      binary: {
        checkMD5: false,
      },
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
