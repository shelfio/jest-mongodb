const NodeEnvironment = require('jest-environment-node');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {getMongodbMemoryOptions} = require('./helpers');

const debug = require('debug')('jest-mongodb:environment');

const cwd = process.cwd();

const globalConfigPath = path.join(cwd, 'globalConfig.json');

let mongo = new MongoMemoryServer(getMongodbMemoryOptions());

module.exports = class MongoEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    debug('Setup MongoDB Test Environment');

    const globalConfig = JSON.parse(fs.readFileSync(globalConfigPath, 'utf-8'));

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

  runScript(script) {
    return super.runScript(script);
  }
};
