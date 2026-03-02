module.exports = {
  rootDir: ".",
  testEnvironment: "node",
  setupFiles: ["<rootDir>/tests/jest.env.js"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.js"],
  globalTeardown: "<rootDir>/tests/jest.teardown.js"
};