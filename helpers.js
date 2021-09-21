const {resolve} = require('path');

const cwd = process.cwd();

module.exports.getMongodbMemoryOptions = function () {
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
};

module.exports.getMongoURLEnvName = function () {
  try {
    const {mongoURLEnvName} = require(resolve(cwd, 'jest-mongodb-config.js'));

    return mongoURLEnvName || 'MONGO_URL';
  } catch (e) {
    return 'MONGO_URL';
  }
};

module.exports.shouldUseSharedDBForAllJestWorkers = function () {
  try {
    const {useSharedDBForAllJestWorkers} = require(resolve(cwd, 'jest-mongodb-config.js'));

    if (typeof useSharedDBForAllJestWorkers === 'undefined') {
      return true;
    }

    return useSharedDBForAllJestWorkers;
  } catch (e) {
    return true;
  }
};
