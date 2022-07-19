/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  coverageProvider: 'v8',
  rootDir: 'tests',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  }
};
