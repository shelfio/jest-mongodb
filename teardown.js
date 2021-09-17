const debug = require('debug')('jest-mongodb:teardown');

module.exports = async function () {
  debug('Teardown mongod');
  if (global.__MONGOD__) {
    await global.__MONGOD__.stop();
  }
};
