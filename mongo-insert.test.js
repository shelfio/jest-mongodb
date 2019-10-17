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

  it('should insert a doc into collection', async () => {
    const users = db.collection('users');

    const mockUser = {_id: 'some-user-id', name: 'John'};
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
      expect.objectContaining({name: 'Bob'})
    ]);
  });
});
