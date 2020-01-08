const path = require("path");

module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",
  snapshotSerializers: ["enzyme-to-json/serializer"],
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.jest.json",
      isolatedModules: true
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFiles: ["./scripts/test-setup.js"],
  moduleNameMapper: {
    "\\.css$": "<rootDir>/scripts/noop-module.js"
  }
};
