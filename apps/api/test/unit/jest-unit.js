module.exports = {
  preset: 'ts-jest',
  globals: {
    // ts-jest에서 tsconfig를 지정하지 않으면 rootDir에 있는 tsconfig가 적용됨.
    // <rootDir>에 있는 tsconfig에는 path alias가 지정되어 있지 않음.
    // moduleNameMapper option에 있는 alias는 ts-jest가 읽어들인 tsconfig에 있는 ts-path와 매칭시킴.
    // <rootDir>을 '.' 로 설정하면 현재 디렉토리 하위 디렉토리만 접근 가능하게됨. 즉 libs는 접근이 불가능
    // libs에 접근하지 못하면 정의된 test util들을 사용 불가능하게 됨.
    'ts-jest': {
      tsConfig: './apps/api/tsconfig.app.json',
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
  roots: ['<rootDir>/apps/api', '<rootDir>/libs/'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  transformIgnorePatterns: ['^.+\\.js$'],
  testMatch: ['**/api/test/unit/**/*.unit-spec.ts'],
  setupFiles: ['<rootDir>/libs/src/utils/test/testSetUp.ts'],
  clearMocks: true,
  verbose: true,
  moduleNameMapper: {
    '^@libs(|/.*)$': '<rootDir>/libs/src/$1',
    '^@app/test(|/.*)$': '<rootDir>/libs/test/src/$1',
    '^@api/test(|/.*)$': '<rootDir>/apps/api/test/$1',
    '^@api/src(|/.*)$': '<rootDir>/apps/api/src/$1',
  },
};
