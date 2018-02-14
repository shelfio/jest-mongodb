const m = require('.');

it('should export a module', () => {
  expect(m).toBeInstanceOf(Function);
});
