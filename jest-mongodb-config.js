const options = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      skipMD5: true
    },
    autoStart: false
  }
};

if (process.env.TEST_REPLICASET) {
  options.mongodbMemoryServerOptions = {
    replSet: {
      dbName: 'jest',
      storageEngine: 'wiredTiger'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  };
}

module.exports = options;
