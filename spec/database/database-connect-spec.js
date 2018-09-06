import { Client } from "pg";
import { connect } from "../../lib/database/database-connect";
import logger from "../../lib/utilities/logger";

jest.mock("pg");

const databaseOptions = Object.freeze({});

const dummyCallback = jest.fn(() => "Hello!");

describe("connect", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when the client fails to connect", () => {
    beforeEach(() => {
      Client.prototype.connect.mockImplementationOnce(() => Promise.reject("Connect Failure"));
    });

    it("throws the error", async () => {
      expect(connect(databaseOptions, logger.error)).rejects.toBe("Connect Failure");
    });
  });

  describe("when the callback throws an error", () => {

    it("throws the error", async () => {
      expect(
        connect(databaseOptions, () => { throw new Error("Callback Failure!"); }))
        .rejects.toEqual(new Error("Callback Failure!"));
    });
  });

  describe("when the client fails to end", () => {
    beforeEach(() => {
      Client.prototype.end.mockImplementationOnce(() => Promise.reject("End Failure"));
    });

    it("throws the error", async () => {
      expect(connect(databaseOptions, dummyCallback)).rejects.toBe("End Failure");
    });
  });

  describe("when no errors are thrown", () => {

    it("passes the database options to the client", async () => {
      await connect(databaseOptions, dummyCallback);
      expect(Client).toHaveBeenCalledWith(databaseOptions);
    });

    it("calls connect", async () => {
      await connect(databaseOptions, dummyCallback);
      expect(Client.prototype.connect).toHaveBeenCalled;
    });

    it("calls the callback", async () => {
      await connect(databaseOptions, dummyCallback);
      // Calling connect creates a client instance, which we can grab from mock.
      expect(dummyCallback).toHaveBeenCalledWith(Client.mock.instances[0]);
      expect(dummyCallback).toHaveBeenCalledAfter(Client.prototype.connect);
    });

    it("calls end", async () => {
      await connect(databaseOptions, dummyCallback);
      expect(Client.prototype.end).toHaveBeenCalledAfter(dummyCallback);
    });

    it("returns the result of the callback", async () => {
      let result = await connect(databaseOptions, dummyCallback);
      expect(result).toBe("Hello!");
    });
  });
});
