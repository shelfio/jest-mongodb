const fs = require('fs');
const {resolve, join} = require('path');
const {MongoMemoryServer} = require('mongodb-memory-server');
const cwd = process.cwd();

const debug = require('debug')('jest-mongodb:setup');
const mongod = new MongoMemoryServer(getMongodbMemoryOptions());

const globalConfigPath = join(cwd, 'globalConfig.json');

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const options = getMongodbMemoryOptions();
  const mongoURLEnvName = getMongoURLEnvName();

  const mongoConfig = {
    mongoUri: await mongod.getUri(),
    mongoDBName: options.instance.dbName,
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env[mongoURLEnvName] = mongoConfig.mongoUri;
};

function getMongodbMemoryOptions() {
  try {
    const {mongodbMemoryServerOptions} = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      binary: {
        skipMD5: true,
      },
      autoStart: false,
      instance: {},
    };
  }
}

function getMongoURLEnvName() {
  try {
    const {mongoURLEnvName} = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongoURLEnvName || 'MONGO_URL';
  } catch (e) {
    return 'MONGO_URL';
  }
}
