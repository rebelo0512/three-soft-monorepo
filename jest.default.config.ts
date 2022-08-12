export default {
  moduleFileExtensions: ['ts', 'js', 'html'],
  clearMocks: true,
  testRegex: '.*\\..*spec\\.ts$',
  transform: {
    '^.+\\.ts?$': ['@swc/jest']
  },
  coverageProvider: 'v8',
  coverageReporters: ['json', 'lcov', 'text'],
  coveragePathIgnorePatterns: ['node_modules', 'index.ts', '.module.ts', '(.*).js', 'tests/helpers'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
