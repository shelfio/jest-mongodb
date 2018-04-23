# jest-mongodb [![CircleCI](https://img.shields.io/circleci/project/github/vladgolubev/jest-mongodb.svg)](https://circleci.com/gh/vladgolubev/jest-mongodb) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> A working example of MongoDB with Jest

## Usage

Copy these files to your repo:

* `setup.js` - spins up in-memory mongodb server
* `teardown.js` - shuts it down
* `mongo-environment.js` - sets up `__MONGO_URI__` global variable
* `jest.config.js` - glues all together


Run 
```sh
▶ yarn test
yarn run v1.5.1
$ jest --runInBand
Setup MongoDB Test Environment
 PASS  ./mongo-insert.test.js
Teardown MongoDB Test Environment
Setup MongoDB Test Environment
 PASS  ./mongo-aggregate.test.js

Test Suites: 2 passed, 2 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.721s
Ran all test suites.
Teardown mongod
Teardown MongoDB Test Environment
✨  Done in 3.30s.
```

NPM dependencies:

* [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) - required for Jest Async Test Environment

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)
