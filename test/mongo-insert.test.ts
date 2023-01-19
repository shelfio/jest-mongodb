import {MongoClient} from 'mongodb';
import type {Db} from 'mongodb';
import '../src/types';

describe('insert', () => {
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

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
    // @ts-ignore
    await users.insertOne(mockUser);

    const insertedUser = await users.findOne({_id: 'some-user-id'});

    expect(insertedUser).toEqual(mockUser);
  });

  it('should insert many docs into collection', async () => {
    const users = db.collection('users');

    const mockUsers = [{name: 'Alice'}, {name: 'Bob'}];
    await users.insertMany(mockUsers);

    const insertedUsers = await users.find().toArray();

    expect(insertedUsers).toEqual([
      expect.objectContaining({name: 'John'}),
      expect.objectContaining({name: 'Alice'}),
      expect.objectContaining({name: 'Bob'}),
    ]);
  });
});
