/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

import defaultConfig from '../../jest.default.config';

export default {
  ...defaultConfig,
  displayName: 'pkg-configuration',
  roots: ['<rootDir>'],
  coverageDirectory: '../../__coverage__/pkg-configuration'
};
