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

const debug = require('debug')('jest-mongodb:setup');
const mongoMemoryServerOptions = getMongodbMemoryOptions();
const isReplSet = Boolean(mongoMemoryServerOptions.replSet);

debug(`isReplSet ${isReplSet}`);

// @ts-ignore
const mongo: Mongo = isReplSet
  ? new MongoMemoryReplSet(mongoMemoryServerOptions)
  : new MongoMemoryServer(mongoMemoryServerOptions);

module.exports = async (config: JestEnvironmentConfig['projectConfig']) => {
  const globalConfigPath = join(config.rootDir, 'globalConfig.json');

  const options = getMongodbMemoryOptions();
  const mongoConfig: {mongoUri?: string; mongoDBName?: string} = {};

  debug(`shouldUseSharedDBForAllJestWorkers: ${shouldUseSharedDBForAllJestWorkers()}`);

  // if we run one mongodb instance for all tests
  if (shouldUseSharedDBForAllJestWorkers()) {
    if (!mongo.isRunning) {
      await mongo.start();
    }

    const mongoURLEnvName = getMongoURLEnvName();

    mongoConfig.mongoUri = await mongo.getUri();

    process.env[mongoURLEnvName] = mongoConfig.mongoUri;

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongo;
  }

  mongoConfig.mongoDBName = options.instance.dbName;

  // Write global config to disk because all tests run in different contexts.
  writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');
};
