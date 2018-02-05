import sinon from 'sinon';
import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe("connect", () => {
  let MockClient, mockClient, error, callbackStub, connect, databaseOptions;

  beforeEach(() => {

    mockClient = {
      connect: sinon.stub(),
      query: sinon.stub(),
      end: sinon.stub()
    };

    MockClient = sinon.stub().returns(mockClient);

    callbackStub = sinon.stub().resolves("Hello!");

    connect = proxyquire('../../lib/database/database-connect', {
      pg: { Client: MockClient }
    }).connect;

    error = new Error();
    databaseOptions = {};
  });

  context("when the client fails to connect", () => {
    beforeEach(() => mockClient.connect.rejects(error));

    it("throws the error", () => {
      return expect(connect(databaseOptions, callbackStub)).to.be.rejectedWith(error);
    });
  });

  context("when the callback throws an error", () => {
    beforeEach(() => callbackStub.rejects(error));

    it("throws the error", () => {
      return expect(connect(databaseOptions, callbackStub)).to.be.rejectedWith(error);
    });
  });

  context("when the client fails to end", () => {
    beforeEach(() => mockClient.end.rejects(error));

    it("throws the error", () => {
      return expect(connect(databaseOptions, callbackStub)).to.be.rejectedWith(error);
    });
  });

  context("when no errors are thrown", () => {

    it("passes the database options to the client", async () => {
      await connect(databaseOptions, callbackStub);
      expect(MockClient).to.have.been.calledWithNew;
    });

    it("calls connect", async () => {
      await connect(databaseOptions, callbackStub);
      expect(mockClient.connect).to.have.been.called;
    });

    it("calls the callback", async () => {
      await connect(databaseOptions, callbackStub);
      expect(callbackStub).to.have.been.calledAfter(mockClient.connect);
    });

    it("calls end", async () => {
      await connect(databaseOptions, callbackStub);
      expect(mockClient.end).to.have.been.calledAfter(callbackStub);
    });

    it("returns the result of the callback", async () => {
      let result = await connect(databaseOptions, callbackStub);
      expect(result).to.eq("Hello!");
    });
  });
});
