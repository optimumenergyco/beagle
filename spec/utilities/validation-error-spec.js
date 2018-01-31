import { expect } from 'chai';

import ValidationError from '../../lib/utilities/validation-error';

describe("ValidationError", () => {
  let error;

  beforeEach(() => error = new ValidationError());

  it("is an error", () => {
    expect(error).to.be.instanceOf(ValidationError);
  });

  it("has a stack trace", () => {
    expect(error.stack).to.not.be.undefined;
  });
});
