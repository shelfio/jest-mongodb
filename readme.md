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
  preset: '@shelf/jest-mongodb',
};
```

If you have a custom `jest.config.js` make sure you remove `testEnvironment` property, otherwise it will conflict with the preset.

### 2. Create `jest-mongodb-config.js`

See [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server#available-options)

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },
};
```

To use the same database for all tests pass the config like this:

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    instance: {
      dbName: 'jest',
    },
    autoStart: false,
  },
};
```

To use separate database for each jest worker pass the `useSharedDBForAllJestWorkers: false` (doesn't create `process.env` variable when using this option):

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
  },

  useSharedDBForAllJestWorkers: false,
};
```

To use dynamic database name you must pass empty object for instance field:

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },
};
```

To use another uri environment variable name you must set mongoURLEnvName field:

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true,
    },
    instance: {},
    autoStart: false,
  },
  mongoURLEnvName: 'MONGODB_URI',
};
```

To use mongo as a replica set you must add the `replSet` config object and set
`count` and `storageEngine` fields:

```js
module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true,
    },
    autoStart: false,
    instance: {},
    replSet: {
      count: 3,
      storageEngine: 'wiredTiger',
    },
  },
};
```

### 3. Configure MongoDB client

Library sets the `process.env.MONGO_URL` for your convenience, but using of `global.__MONGO_URI__` is preferable as it works with ` useSharedDBForAllJestWorkers: false`

```js
const {MongoClient} = require('mongodb');

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
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

#### 6. Jest watch mode gotcha

This package creates the file `globalConfig.json` in the project root, when using jest `--watch` flag, changes to `globalConfig.json` can cause an infinite loop

In order to avoid this unwanted behaviour, add `globalConfig` to ignored files in watch mode in the Jest configuation

```js
// jest.config.js
module.exports = {
  watchPathIgnorePatterns: ['globalConfig'],
};
```

## See Also

- [jest-dynamodb](https://github.com/shelfio/jest-dynamodb)

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
