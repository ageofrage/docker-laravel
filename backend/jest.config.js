module.exports = {
  globals: {
    "ts-jest": {
      tsConfig: "tsConfig.json",
    },
  },
  roots: ["<rootDir>/project/src"],
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
};
