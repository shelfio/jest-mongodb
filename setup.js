const fs = require('fs');
const {resolve, join} = require('path');
const cwd = require('cwd');
const MongodbMemoryServer = require('mongodb-memory-server');
const globalConfigPath = join(__dirname, 'globalConfig.json');

const debug = require('debug')('jest-mongodb:setup');

let isReplicaSet = false;

function getMongoDBInstanceType() {
  const options = getMongodbMemoryOptions();

  if (isReplicaSet) return new MongodbMemoryServer.MongoMemoryReplSet(options);
  else return new MongodbMemoryServer.default(options);
}
const mongod = getMongoDBInstanceType();

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  if (isReplicaSet) await mongod.waitUntilRunning();

  const mongoConfig = {
    mongoDBName: await mongod.getDbName(),
    mongoUri: await mongod.getConnectionString()
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  debug('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env.MONGO_URL = mongoConfig.mongoUri;
};

function getMongodbMemoryOptions() {
  try {
    const {mongodbMemoryServerOptions} = require(resolve(cwd(), 'jest-mongodb-config.js'));

    isReplicaSet = typeof mongodbMemoryServerOptions.replSet === 'object';

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      instance: {
        dbName: 'jest'
      },
      binary: {
        skipMD5: true
      },
      autoStart: false
    };
  }
}
