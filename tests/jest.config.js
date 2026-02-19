module.exports = {
  testEnvironment: "node",
  globalTeardown: "<rootDir>/tests/jest.teardown.js",
  setupFiles: ["<rootDir>/tests/jest.env.js"]
};
