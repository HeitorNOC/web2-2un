// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/$1',
//   },
//   transform: {
//     '^.+\\.tsx?$': 'ts-jest',
//   },
//   extensionsToTreatAsEsm: ['.ts', '.tsx'],
// };

module.exports = {
  preset: 'ts-jest/presets/default-esm', 
  testEnvironment: 'node', 
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest', 
  },
  transformIgnorePatterns: [
    '/node_modules/(?!.*)', 
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx', '.jsx'],
};