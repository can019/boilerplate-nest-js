{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": "../../../../",
  "testEnvironment": "node",
  "testRegex": ".unit-spec.ts$",
  "transform": {
    "^.+\\.(t|j)s$": "ts-jest"
  },
  "roots": ["<rootDir>/apps/", "<rootDir>/libs/"],
  "moduleNameMapper": {
    "^@libs(|/.*)$": "<rootDir>/libs/src/$1",
    "^@app/test(|/.*)$": "<rootDir>/libs/test/src/$1",
    "^@admin/test(|/.*)$": "<rootDir>/apps/admin/test/$1",
    "^@admin/src(|/.*)$": "<rootDir>/apps/admin/src/$1"
  }
}
