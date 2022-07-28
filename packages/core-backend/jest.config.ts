import defaultConfig from '../../jest.default.config';

export default {
  ...defaultConfig,
  displayName: 'core-backend',
  roots: ['<rootDir>'],
  coverageDirectory: '../../__coverage__/core-backend'
};
