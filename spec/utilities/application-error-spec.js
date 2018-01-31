import { expect } from 'chai';

import ApplicationError from '../../lib/utilities/application-error';

describe("ApplicationError", () => {
  let error;

  beforeEach(() => error = new ApplicationError());

  it("is an error", () => {
    expect(error).to.be.instanceOf(ApplicationError);
  });

  it("has a stack trace", () => {
    expect(error.stack).to.not.be.undefined;
  });
});
