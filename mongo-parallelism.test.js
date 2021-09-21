const {MongoClient} = require('mongodb');
const {shouldUseSharedDBForAllJestWorkers} = require('./helpers');

describe('parallelism: first worker', () => {
  const uri = global.__MONGO_URI__;
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(uri, {
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

    await collection.insertOne({a: 1});
    const count = await collection.count({});

    if (!shouldUseSharedDBForAllJestWorkers()) {
      expect(count).toBe(1);
    }
  });
});
