module.exports = {
  preset: 'ts-jest',
  globals: {
    'ts-jest': {
      tsConfig: './apps/admin/tsconfig.app.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  rootDir: '../../../../',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coveragePathIgnorePatterns: ['node_modules'], // full path를 적어주어야 함. dir단위도 좋음.
  coverageDirectory: './coverage',
  roots: ['<rootDir>/apps/admin', '<rootDir>/libs/'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transformIgnorePatterns: ['^.+\\.js$'],
  testMatch: ['**/admin/test/unit/**/*.unit-spec.ts'],
  setupFiles: ['<rootDir>/libs/src/utils/test/testSetUp.ts'],
  clearMocks: true,
  verbose: true,
  moduleNameMapper: {
    '^@libs(|/.*)$': '<rootDir>/libs/src/$1',
    '^@app/test(|/.*)$': '<rootDir>/libs/test/src/$1',
    '^@admin/src(|/.*)$': '<rootDir>/apps/admin/src/$1',
    '^@admin/test(|/.*)$': '<rootDir>/apps/admin/test/$1',
  },
};
