module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverage: true,
  coverageReporters: ["text-summary"],
  collectCoverageFrom: ["src/**/*.ts"],
  roots: ["src"],
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
};
