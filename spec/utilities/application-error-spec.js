import ApplicationError from '../../lib/utilities/application-error';

describe("ApplicationError", () => {
  let error;

  beforeEach(() => error = new ApplicationError());

  it("is an error", () => {
    expect(error).toBeInstanceOf(ApplicationError);
  });

  it("has a stack trace", () => {
    expect(error.stack).not.toBeUndefined;
  });
});
