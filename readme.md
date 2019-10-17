# jest-mongodb [![CircleCI](https://circleci.com/gh/shelfio/jest-mongodb/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/jest-mongodb/tree/master) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg) [![npm (scoped)](https://img.shields.io/npm/v/@shelf/jest-mongodb.svg)](https://www.npmjs.com/package/@shelf/jest-mongodb)

> Jest preset to run MongoDB memory server

## Usage

### 0. Install

```
$ yarn add @shelf/jest-mongodb --dev
```

Make sure `mongodb` is installed in the project as well, as it's required as a peer dependency.

### 1. Create `jest.config.js`

```js
module.exports = {
  preset: '@shelf/jest-mongodb'
};
```

If you have a custom `jest.config.js` make sure you remove `testEnvironment` property, otherwise it will conflict with the preset.

### 2. Create `jest-mongodb-config.js`

See [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server#available-options)

```js
module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    autoStart: false
  }
};
```

### 3. Configure MongoDB client

Library sets the `process.env.MONGO_URL` for your convenience

```js
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
});
```

### 4. PROFIT! Write tests

```js
it('should insert a doc into collection', async () => {
  const users = db.collection('users');

  const mockUser = {_id: 'some-user-id', name: 'John'};
  await users.insertOne(mockUser);

  const insertedUser = await users.findOne({_id: 'some-user-id'});
  expect(insertedUser).toEqual(mockUser);
});
```

Cache MongoDB binary in CI by putting this folder to the list of cached paths: `./node_modules/.cache/mongodb-memory-server/mongodb-binaries`

You can enable debug logs by setting environment variable `DEBUG=jest-mongodb:*`

#### 5. Clean collections before each test (optional)

```js
beforeEach(async () => {
  await db.collection('COLLECTION_NAME').deleteMany({});
});
```

<sub>See [this issue](https://github.com/shelfio/jest-mongodb/issues/173) for discussion</sub>

## See Also

- [jest-dynamodb](https://github.com/shelfio/jest-dynamodb)

## License

MIT © [Shelf](https://shelf.io)
