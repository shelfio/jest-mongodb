/** @type {import('./src/types').Config} */
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
  mongoURLEnvName: 'MONGO_URL',
};
