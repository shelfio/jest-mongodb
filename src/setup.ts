/* eslint-disable multiline-ternary */
import {writeFileSync} from 'fs';
import {join} from 'path';
import {MongoMemoryReplSet, MongoMemoryServer} from 'mongodb-memory-server';
import type {JestEnvironmentConfig} from '@jest/environment';
import type {Mongo} from './types';
import {
  getMongoURLEnvName,
  getMongodbMemoryOptions,
  shouldUseSharedDBForAllJestWorkers,
} from './helpers';
import {isMongoMemoryReplSetOptions} from './helpers';

const debug = require('debug')('jest-mongodb:setup');

module.exports = async (config: JestEnvironmentConfig['globalConfig']) => {
  const globalConfigPath = join(config.rootDir, 'globalConfig.json');

  const mongoMemoryServerOptions = getMongodbMemoryOptions(config.rootDir);
  const isReplSet = isMongoMemoryReplSetOptions(mongoMemoryServerOptions);

  debug(`isReplSet ${isReplSet}`);

  // @ts-ignore
  const mongo: Mongo = isReplSet
    ? new MongoMemoryReplSet(mongoMemoryServerOptions)
    : new MongoMemoryServer(mongoMemoryServerOptions);

  const options = getMongodbMemoryOptions(config.rootDir);
  const mongoConfig: {mongoUri?: string; mongoDBName?: string} = {};

  debug(
    `shouldUseSharedDBForAllJestWorkers: ${shouldUseSharedDBForAllJestWorkers(config.rootDir)}`
  );

  // if we run one mongodb instance for all tests
  if (shouldUseSharedDBForAllJestWorkers(config.rootDir)) {
    if (!mongo.isRunning) {
      await mongo.start();
    }

    const mongoURLEnvName = getMongoURLEnvName(config.rootDir);

    mongoConfig.mongoUri = await mongo.getUri();

    process.env[mongoURLEnvName] = mongoConfig.mongoUri;

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongo;
  }

  mongoConfig.mongoDBName = isMongoMemoryReplSetOptions(options) ? '' : options?.instance?.dbName;

  // Write global config to disk because all tests run in different contexts.
  writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');
};
