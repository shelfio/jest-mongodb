/* eslint-disable */
import { MongoMemoryReplSet, MongoMemoryServer } from "mongodb-memory-server";

declare global {
  var __MONGOD__: Mongo;
  var __MONGO_URI__: string;
  var __MONGO_DB_NAME__: string
}

export type Mongo = (MongoMemoryReplSet | MongoMemoryServer) & {isRunning: boolean}
