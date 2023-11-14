import type { JestConfigWithTsJest } from "ts-jest";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  rootDir: "./tests",
};

export default jestConfig;
