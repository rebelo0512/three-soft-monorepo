/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  displayName: 'core-backend',
  clearMocks: true,
  coverageProvider: 'v8',
  rootDir: 'tests',
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  }
};
