const fs = require('fs');
const {join} = require('path');
const {MongoMemoryServer, MongoMemoryReplSet} = require('mongodb-memory-server');
const {
  getMongodbMemoryOptions,
  getMongoURLEnvName,
  shouldUseSharedDBForAllJestWorkers,
} = require('./helpers');

const debug = require('debug')('jest-mongodb:setup');
const mongoMemoryServerOptions = getMongodbMemoryOptions();
const isReplSet = Boolean(mongoMemoryServerOptions.replSet);

debug(`isReplSet ${isReplSet}`);

const mongo = isReplSet
  ? new MongoMemoryReplSet(mongoMemoryServerOptions)
  : new MongoMemoryServer(mongoMemoryServerOptions);

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = async () => {
  const options = getMongodbMemoryOptions();
  const mongoConfig = {};

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
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');
};
