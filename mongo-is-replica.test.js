const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  // Differs depending on which suite type of connection is used
  // eslint-disable-next-line jest/no-if
  it(`should ${process.env.TEST_REPLICASET ? 'not' : ''} connect to a replica set`, async () => {
    const test_cmd = db.admin().command({replSetGetStatus: 1});

    // eslint-disable-next-line jest/no-if
    if (process.env.TEST_REPLICASET) {
      const result = await test_cmd;

      expect(result.members[0].stateStr).toBe('PRIMARY');
    } else await expect(test_cmd).rejects.toThrow('not running with --replSet');
  });
});
