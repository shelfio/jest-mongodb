import {join as pathJoin} from 'path';
import {readFileSync} from 'fs';
import {randomUUID} from 'crypto';
import {TestEnvironment} from 'jest-environment-node';
import {MongoMemoryReplSet, MongoMemoryServer} from 'mongodb-memory-server';
import type {EnvironmentContext} from '@jest/environment';
import type {JestEnvironmentConfig} from '@jest/environment';
import {getMongodbMemoryOptions} from './helpers';

// eslint-disable-next-line import/order
const debug = require('debug')('jest-mongodb:environment');

const options = getMongodbMemoryOptions();
const isReplSet = Boolean(options.replSet);

debug(`isReplSet`, isReplSet);

const mongo = isReplSet ? new MongoMemoryReplSet(options) : new MongoMemoryServer(options);

module.exports = class MongoEnvironment extends TestEnvironment {
  globalConfigPath: string;
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.globalConfigPath = pathJoin(config.projectConfig.rootDir, 'globalConfig.json');
  }

  async setup() {
    debug('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(readFileSync(this.globalConfigPath, 'utf-8'));

    if (globalConfig.mongoUri) {
      this.global.__MONGO_URI__ = globalConfig.mongoUri;
    } else {
      await mongo.start();

      this.global.__MONGO_URI__ = mongo.getUri();
    }

    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName || randomUUID();

    await super.setup();
  }

  async teardown() {
    debug('Teardown MongoDB Test Environment');

    await mongo.stop();

    await super.teardown();
  }

  // @ts-ignore
  runScript(script) {
    // @ts-ignore
    return super.runScript(script);
  }
};
