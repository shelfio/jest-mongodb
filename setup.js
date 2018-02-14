const MongodbMemoryServer = require('mongodb-memory-server');

const MONGO_DB_NAME = 'jest';
const mongod = new MongodbMemoryServer({
  instance: {
    dbName: MONGO_DB_NAME
  },
  binary: {
    version: '3.2.19'
  }
});

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

module.exports = async function() {
  global.__MONGOD__ = mongod;
  global.__MONGO_URL__ = await mongod.getConnectionString();
  global.__MONGO_DB_NAME__ = MONGO_DB_NAME;
};
