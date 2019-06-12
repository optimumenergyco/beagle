import * as connection from "../../lib/database/database-connect";
import * as queries from "../../lib/database/database-queries";
import DatabaseClient from "../../lib/database/database-client";
import * as logger from "../../lib/utilities/logger";

const migration = Object.freeze({ sql: "--", timestamp: "19881005000000" });

const dummyClient = {
  query: logger.info
};

// Query spies
// isSetUp
const isSetUpSpy = jest.spyOn(queries, "isSetUp");
isSetUpSpy.mockImplementation(async () => Promise.resolve(true));
// setup
const setUpSpy = jest.spyOn(queries, "setUp");
setUpSpy.mockImplementation(async () => Promise.resolve());
// completedTimestamps
const completedTimestampsSpy = jest.spyOn(queries, "completedTimestamps");
completedTimestampsSpy.mockImplementation(async () => Promise.resolve([ migration.timestamp ]));
// migrateUp
const migrateUpSpy = jest.spyOn(queries, "migrateUp");
migrateUpSpy.mockImplementation(async () => Promise.resolve());
// migrateDown
const migrateDownSpy = jest.spyOn(queries, "migrateDown");
migrateDownSpy.mockImplementation(async () => Promise.resolve());

// DB Connection spy
const connectSpy = jest.spyOn(connection, "connect");
connectSpy.mockImplementation(async (options, callback) => {
  let client = dummyClient;
  return await callback(client);
});

describe("DatabaseClient", () => {
  const connectionOptions = Object.freeze({ host: "hello" });
  let client;

  beforeEach(() => {
    client = new DatabaseClient(connectionOptions);
    jest.clearAllMocks();
  });

  describe("#isSetUp", () => {

    it("connects to the client", async () => {
      await client.isSetUp();
      expect(connectSpy).toHaveBeenCalledWith(connectionOptions, queries.isSetUp);
    });

    it("the client invokes the isSetup callback query", async () => {
      await client.isSetUp();
      expect(isSetUpSpy).toHaveBeenCalledWith(dummyClient);
    });
  });

  describe("#setUp", () => {

    it("connects to the client", async () => {
      await client.setUp();
      expect(connectSpy).toHaveBeenCalledWith(connectionOptions, queries.setUp);
    });

    it("calls the setUp query", async () => {
      await client.setUp();
      expect(setUpSpy).toHaveBeenCalledWith(dummyClient);
    });
  });

  describe("#completedTimestamps", () => {

    it("connects to the client", async () => {
      await client.completedTimestamps();
      expect(connectSpy).toHaveBeenCalledWith(connectionOptions, queries.completedTimestamps);
    });

    it("returns the result of completedTimestamps", async () => {
      expect(await client.completedTimestamps()).toEqual([ "19881005000000" ]);
    });
  });

  describe("#migrateUp", () => {

    it("connects to the client", async () => {
      await client.migrateUp(migration);
      expect(connectSpy).toHaveBeenCalled();
    });

    it("calls the migrateUp query", async () => {
      await client.migrateUp(migration);
      expect(migrateUpSpy).toHaveBeenCalledWith(dummyClient, migration);
    });
  });

  describe("#migrateDown", () => {

    it("connects to the client", async () => {
      await client.migrateDown(migration);
      expect(connectSpy).toHaveBeenCalled();
    });

    it("calls the migrateDown query", async () => {
      await client.migrateDown(migration);
      expect(migrateDownSpy).toHaveBeenCalledWith(dummyClient, migration);
    });
  });
});
