module.exports = {
  globalSetup: "<rootDir>/tests/jest.globalSetup.js",
  testEnvironment: "node",
  globalTeardown: "<rootDir>/tests/jest.teardown.js",
  setupFiles: ["<rootDir>/tests/jest.env.js"]
};
