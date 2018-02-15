const {MongoClient} = require('mongodb');

let connection;
let db;

beforeAll(async () => {
  connection = await MongoClient.connect(global.__MONGO_URI__);
  db = await connection.db(global.__MONGO_DB_NAME__);
});

afterAll(async () => {
  await db.close();
});

it('should insert a doc into collection', async () => {
  const users = db.collection('users');

  await users.insertOne({_id: 'some-user-id', name: 'John'});
  const insertedUser = await users.findOne({_id: 'some-user-id'});

  expect(insertedUser).toEqual({});
});
