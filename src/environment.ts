import {TestEnvironment} from 'jest-environment-node';
import {join as pathJoin} from 'path';
import {readFileSync} from 'fs';
import type {EnvironmentContext} from '@jest/environment';
import type {JestEnvironmentConfig} from '@jest/environment';
import {MongoMemoryReplSet, MongoMemoryServer} from 'mongodb-memory-server';
import {getMongodbMemoryOptions} from './helpers';

const uuid = require('uuid');

// eslint-disable-next-line import/order
const debug = require('debug')('jest-mongodb:environment');

const cwd = process.cwd();

const globalConfigPath = pathJoin(cwd, 'globalConfig.json');
const options = getMongodbMemoryOptions();
const isReplSet = Boolean(options.replSet);

debug(`isReplSet`, isReplSet);

const mongo = isReplSet ? new MongoMemoryReplSet(options) : new MongoMemoryServer(options);

module.exports = class MongoEnvironment extends TestEnvironment {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
  }

  async setup() {
    debug('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(readFileSync(globalConfigPath, 'utf-8'));

    if (globalConfig.mongoUri) {
      this.global.__MONGO_URI__ = globalConfig.mongoUri;
    } else {
      await mongo.start();

      this.global.__MONGO_URI__ = mongo.getUri();
    }

    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName || uuid.v4();

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
