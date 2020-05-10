module.exports = {
  // "transform": {
  //   "^.+\\.spec\\.ts$": "ts-jest"
  // },
  // "moduleFileExtensions": ["ts", "js"],
  // "preset": "ts-jest/presets/js-with-ts",
  "testEnvironment": "node",
  "testMatch": [
    "**/tests/**/*.spec.ts"
  ],
  transformIgnorePatterns: ['^.+\\.js$'],
  silent: true
}
