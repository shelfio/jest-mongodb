const fs = require('fs');
const {resolve, join} = require('path');
const cwd = require('cwd');
const MongodbMemoryServer = require('mongodb-memory-server');
const globalConfigPath = join(__dirname, 'globalConfig.json');

const mongod = new MongodbMemoryServer.default(getMongodbMemoryOptions());

module.exports = async () => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: 'jest',
    mongoUri: await mongod.getConnectionString()
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));
  console.log('Config is written');

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;
  process.env.MONGO_URL = mongoConfig.mongoUri;
};

function getMongodbMemoryOptions() {
  try {
    const {mongodbMemoryServerOptions} = require(resolve(cwd(), 'jest-mongodb-config.js'));

    return mongodbMemoryServerOptions;
  } catch (e) {
    return {
      instance: {
        dbName: 'jest'
      },
      binary: {
        version: '3.2.18'
      },
      autoStart: false
    };
  }
}
