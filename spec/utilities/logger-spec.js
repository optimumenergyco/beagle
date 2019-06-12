import chalk from "chalk";

import logger from "../../lib/utilities/logger";

// Logger mocked ( suppressed by default ), so we unmock for testing.
jest.unmock("../../lib/utilities/logger");

// To avoid interfering with Mocha's formatter, stubbing `process.stdout.write` much be done within
// each test's `it` function, not in `beforeEach` and `afterEach` functions.
function stubStdout(callback) {

  let stdoutWrite;

  return () => {
    stdoutWrite = process.stdout.write;
    process.stdout.write = jest.fn();

    try {
      callback();
    }
    finally {
      process.stdout.write = stdoutWrite;
    }
  };
}

describe("logger", () => {

  describe("#info", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.info("Hello!");
      expect(process.stdout.write).toHaveBeenCalledWith("👋 Hello!\n");
    }));
  });

  describe("#success", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.success("Hello!");
      expect(process.stdout.write).toHaveBeenCalledWith(`${ chalk.greenBright("👍 Hello!") }\n`);
    }));
  });

  describe("#error", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.error("Hello!");
      expect(process.stdout.write).toHaveBeenCalledWith(`${ chalk.redBright("✋ Hello!") }\n`);
    }));
  });

  describe("#notice", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.notice("Hello!");
      expect(process.stdout.write).toHaveBeenCalledWith(`${ chalk.blueBright("👉 Hello!") }\n`);
    }));
  });
});
