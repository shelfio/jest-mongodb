module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    replSet: {
      count: 4,
      storageEngine: 'wiredTiger',
    },
  },
  mongoURLEnvName: 'MONGO_URL',
};
