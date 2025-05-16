import {join as pathJoin} from 'path';
import {readFileSync} from 'fs';
import {randomUUID} from 'crypto';
import {TestEnvironment} from 'jest-environment-node';
import {MongoMemoryReplSet, MongoMemoryServer} from 'mongodb-memory-server';
import type {EnvironmentContext} from '@jest/environment';
import type {JestEnvironmentConfig} from '@jest/environment';
import {getMongodbMemoryOptions} from './helpers';

const debug = require('debug')('jest-mongodb:environment');

type MongoMemoryReplSetOpts = NonNullable<ConstructorParameters<typeof MongoMemoryReplSet>[0]>;
type MongoMemoryServerOpts = NonNullable<ConstructorParameters<typeof MongoMemoryServer>[0]>;

export function isMongoMemoryReplSetOptions(
  options?: MongoMemoryReplSetOpts | MongoMemoryServerOpts
): options is MongoMemoryReplSetOpts {
  return Boolean((options as MongoMemoryReplSetOpts).replSet);
}

module.exports = class MongoEnvironment extends TestEnvironment {
  globalConfigPath: string;
  mongo: MongoMemoryReplSet | MongoMemoryServer;
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context);
    this.globalConfigPath = pathJoin(config.globalConfig.rootDir, 'globalConfig.json');

    const options = getMongodbMemoryOptions(config.globalConfig.rootDir);
    const isReplSet = isMongoMemoryReplSetOptions(options);
    debug(`isReplSet`, isReplSet);

    this.mongo = isReplSet ? new MongoMemoryReplSet(options) : new MongoMemoryServer(options);
  }

  async setup() {
    debug('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(readFileSync(this.globalConfigPath, 'utf-8'));

    if (globalConfig.mongoUri) {
      this.global.__MONGO_URI__ = globalConfig.mongoUri;
    } else {
      await this.mongo.start();

      this.global.__MONGO_URI__ = this.mongo.getUri();
    }

    this.global.__MONGO_DB_NAME__ = globalConfig.mongoDBName || randomUUID();

    await super.setup();
  }

  async teardown() {
    debug('Teardown MongoDB Test Environment');

    await this.mongo.stop();

    await super.teardown();
  }

  // @ts-ignore
  runScript(script) {
    // @ts-ignore
    return super.runScript(script);
  }
};
