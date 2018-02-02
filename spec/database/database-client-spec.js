import { expect } from 'chai';
import sinon from 'sinon';
import proxyquire from 'proxyquire';

describe("DatabaseClient", () => {
  let connectionOptions, migration, connectStub, isSetUpStub, setUpStub, completedTimestampsStub,
    migrateUpStub, migrateDownStub, mockClient, client;

  beforeEach(() => {
    connectionOptions = { host: "hello" };
    migration = { sql: "--", timestamp: "19881005000000" };

    isSetUpStub = sinon.stub().resolves(true);
    setUpStub = sinon.stub().resolves();
    completedTimestampsStub = sinon.stub().resolves([ "19881005000000" ]);
    migrateUpStub = sinon.stub().resolves();
    migrateDownStub = sinon.stub().resolves();
    mockClient = { query: sinon.stub() };

    connectStub = sinon.spy((options, callback) => callback(mockClient));

    let DatabaseClient = proxyquire('../../lib/database/database-client', {
      "./database-connect": {
        connect: connectStub
      },
      "./database-queries": {
        isSetUp: isSetUpStub,
        setUp: setUpStub,
        completedTimestamps: completedTimestampsStub,
        migrateUp: migrateUpStub,
        migrateDown: migrateDownStub
      }
    }).default;

    client = new DatabaseClient(connectionOptions);
  });

  describe("#isSetUp", () => {

    it("connects to the client", async () => {
      await client.isSetUp();
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });

    it("returns the result of isSetUp", async () => {
      expect(await client.isSetUp()).to.eq(true);
    });
  });

  describe("#setUp", () => {

    it("connects to the client", async () => {
      await client.setUp();
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });

    it("calls the setUp query", async () => {
      await client.setUp();
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });
  });

  describe("#completedTimestamps", () => {

    it("connects to the client", async () => {
      await client.completedTimestamps();
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });

    it("returns the result of completedTimestamps", async () => {
      expect(await client.completedTimestamps()).to.eql([ '19881005000000' ]);
    });
  });

  describe("#migrateUp", () => {

    it("connects to the client", async () => {
      await client.migrateUp(migration);
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });

    it("calls the migrateUp query", async () => {
      await client.migrateUp(migration);
      expect(migrateUpStub).to.have.been.calledWith(mockClient, migration);
    });
  });

  describe("#migrateDown", () => {

    it("connects to the client", async () => {
      await client.migrateDown(migration);
      expect(connectStub).to.have.been.calledWith(connectionOptions, sinon.match.func);
    });

    it("calls the migrateDown query", async () => {
      await client.migrateDown(migration);
      expect(migrateDownStub).to.have.been.calledWith(mockClient, migration);
    });
  });
});
