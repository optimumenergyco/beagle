import chalk from 'chalk';
import sinon from 'sinon';
import { expect } from 'chai';

import logger from '../../lib/utilities/logger';

// To avoid interfering with Mocha's foramtter, stubbing `process.stdout.write` much be done within
// each test's `it` function, not in `beforeEach` and `afterEach` functions.
function stubStdout(callback) {
  return () => {
    sinon.stub(process.stdout, 'write');

    try {
      callback();
    }
    finally {
      process.stdout.write.restore();
    }
  };
}

describe("logger", () => {

  describe("#info", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.info('Hello!');
      expect(process.stdout.write).to.have.been.calledWith('》Hello!\n');
    }));
  });

  describe("#success", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.success('Hello!');
      expect(process.stdout.write).to.have.been.calledWith(`${ chalk.greenBright('✔️ Hello!') }\n`);
    }));
  });

  describe("#error", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.error('Hello!');
      expect(process.stdout.write).to.have.been.calledWith(`${ chalk.redBright('❗ Hello!') }\n`);
    }));
  });

  describe("#notice", () => {

    it("writes the message to stdout", stubStdout(() => {
      logger.notice('Hello!');
      expect(process.stdout.write).to.have.been.calledWith(`${ chalk.blueBright('➡️ Hello!') }\n`);
    }));
  });
});
