import type {Db} from 'mongodb';
import {MongoClient} from 'mongodb';
import '../src/types';
import {shouldUseSharedDBForAllJestWorkers} from '../src/helpers';

describe('parallelism: second worker', () => {
  const uri = global.__MONGO_URI__;
  let connection: MongoClient;
  let db: Db;

  beforeAll(async () => {
    // @ts-ignore
    connection = await MongoClient.connect(uri, {
      // @ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  it('should have separate database', async () => {
    const collection = db.collection('parallelism-test');

    await collection.insertMany([{a: 1}, {b: 2}]);
    const count = await collection.count({});

    if (!shouldUseSharedDBForAllJestWorkers()) {
      expect(count).toBe(2);
    }
  });
});
