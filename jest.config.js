module.exports = {
  testMatch: [
    "**/spec/**/*-spec.js"
  ],
  collectCoverageFrom: [
    "source/**",
    "lib/**"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/"
  ],
  setupFilesAfterEnv: [ "./spec/spec_helper" ],
  unmockedModulePathPatterns: [
    "lodash"
  ]
};
