const debug = require('debug')('jest-mongodb:teardown');

module.exports = async function() {
  debug('Teardown mongod');
  await global.__MONGOD__.stop();
};
