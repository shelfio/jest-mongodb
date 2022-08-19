import {resolve} from 'path';

export * from './types';

export default {
  globalSetup: resolve(__dirname, './setup.js'),
  globalTeardown: resolve(__dirname, './teardown.js'),
  testEnvironment: resolve(__dirname, './environment.js'),
};
