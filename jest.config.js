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
  setupTestFrameworkScriptFile: "./spec/spec_helper",
  unmockedModulePathPatterns: [
    "lodash"
  ]
};
