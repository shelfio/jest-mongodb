# jest-mongodb [![CircleCI](https://img.shields.io/circleci/project/github/vladgolubev/jest-mongodb.svg)](https://circleci.com/gh/vladgolubev/jest-mongodb) ![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> A working example of MongoDB with Jest

## Usage

Copy these files to your repo:

* `setup.js` - spins up in-memory mongodb server
* `teardown.js` - shuts it down
* `mongo-environment.js` - sets up `__MONGO_URI__` global variable
* `jest.config.js` - glues all together

NPM dependencies:

* [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server) - required for Jest Async Test Environment

## License

MIT © [Vlad Holubiev](https://vladholubiev.com)
