/* eslint-disable */
import { MongoMemoryReplSet, MongoMemoryServer } from "mongodb-memory-server";

declare global {
  var __MONGOD__: Mongo;
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string
}

export type Mongo = (MongoMemoryReplSet | MongoMemoryServer) & {isRunning: boolean}

type MongoMemoryReplSetOpts = NonNullable<ConstructorParameters<typeof MongoMemoryReplSet>[0]>;
type MongoMemoryServerOpts = NonNullable<ConstructorParameters<typeof MongoMemoryServer>[0]>;

export interface Config {
  mongodbMemoryServerOptions?: MongoMemoryReplSetOpts | MongoMemoryServerOpts;
  /**
   * @default 'MONGO_URL'
   */
  mongoURLEnvName?: string;
  /**
   * @default true
   */
  useSharedDBForAllJestWorkers?: boolean;
}
