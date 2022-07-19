/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  displayName: 'core-backend',
  clearMocks: true,
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageProvider: 'v8',
  coverageDirectory: '../../__coverage__/core-backend',
  coverageReporters: ['json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ['node_modules', 'index.ts', '.module.ts', 'tests/helpers']
};
