/* eslint-disable */
const { readFileSync } = require('fs');

const swcJestConfig = JSON.parse(readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8'));
swcJestConfig.swcrc = false;

module.exports = {
  displayName: 'example',
  preset: '../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  transformIgnorePatterns: [],
  moduleNameMapper: {
    '^@santoshyadavdev/firecrawl-sdk$': '<rootDir>/../libs/firecrawl-sdk/src/index.ts',
  },
  coverageDirectory: 'test-output/jest/coverage',
};
