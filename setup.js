const fs = require('fs');
const {join} = require('path');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {
  getMongodbMemoryOptions,
  getMongoURLEnvName,
  shouldUseSharedDBForAllJestWorkers,
} = require('./helpers');

const debug = require('debug')('jest-mongodb:setup');
const mongod = new MongoMemoryServer(getMongodbMemoryOptions());

const cwd = process.cwd();
const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = async () => {
  const options = getMongodbMemoryOptions();
  const mongoConfig = {};

  debug(`shouldUseSharedDBForAllJestWorkers: ${shouldUseSharedDBForAllJestWorkers()}`);

  // if we run one mongodb instance for all tests
  if (shouldUseSharedDBForAllJestWorkers()) {
    if (!mongod.isRunning) {
      await mongod.start();
    }

    const mongoURLEnvName = getMongoURLEnvName();

    mongoConfig.mongoUri = await mongod.getUri();

    process.env[mongoURLEnvName] = mongoConfig.mongoUri;

    // Set reference to mongod in order to close the server during teardown.
    global.__MONGOD__ = mongod;
  }

  mongoConfig.mongoDBName = options.instance.dbName;

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');
};
