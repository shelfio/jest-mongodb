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
    replSet: {storageEngine: 'wiredTiger'},
    autoStart: false
  };
}

module.exports = options;
