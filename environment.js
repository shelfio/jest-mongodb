const NodeEnvironment = require('jest-environment-node');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const {MongoMemoryServer, MongoMemoryReplSet} = require('mongodb-memory-server');
const {getMongodbMemoryOptions} = require('./helpers');

const debug = require('debug')('jest-mongodb:environment');

const cwd = process.cwd();

const globalConfigPath = path.join(cwd, 'globalConfig.json');
const options = getMongodbMemoryOptions();
const isReplSet = Boolean(options.replSet);

const TestEnvironment = NodeEnvironment.default ? NodeEnvironment.default : NodeEnvironment;

debug(`isReplSet`, isReplSet);

let mongo = isReplSet ? new MongoMemoryReplSet(options) : new MongoMemoryServer(options);

module.exports = class MongoEnvironment extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
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
