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

module.exports = async function() {
  global.__MONGO_URL__ = await mongod.getConnectionString();
  global.__MONGO_DB_NAME__ = MONGO_DB_NAME;
};
