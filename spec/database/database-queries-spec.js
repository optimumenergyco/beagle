import sinon from 'sinon';
import { expect } from 'chai';

import {
  isSetUp,
  setUp,
  completedTimestamps,
  migrateUp,
  migrateDown
} from '../../lib/database/database-queries';

let mockClient, sql, timestamp, error;

beforeEach(() => {
  mockClient = { query: sinon.stub() };
  sql = "-- Hello";
  timestamp = "19881005000000";
  error = new Error();
  // mockClient.query.resolves();
});

describe("isSetUp", () => {
  beforeEach(() => mockClient.query.resolves({ rows: [ { exists: true } ] }));

  it("queries the migration table", async () => {
    await isSetUp(mockClient);
    expect(mockClient.query).to.have.been.calledWithMatch(/SELECT\s+EXISTS/i);
  });

  context("when the migrations table exists", () => {

    it("returns true", async () => {
      expect(await isSetUp(mockClient)).to.eq(true);
    });
  });

  context("when the migrations table does not exist", () => {
    beforeEach(() => mockClient.query.resolves({ rows: [ { exists: false } ] }));

    it("returns false", async () => {
      expect(await isSetUp(mockClient)).to.eq(false);
    });
  });
});

describe("setUp", () => {

  it("runs a query to create the migrations table", async () => {
    await setUp(mockClient);
    expect(mockClient.query).to.have.been.calledWithMatch(/CREATE\s+TABLE\s+migrations/i);
  });
});

describe("completedTimestamps", () => {
  beforeEach(() => {
    mockClient.query.resolves({ rows: [
      { timestamp },
      { timestamp: '20181005000000' }
    ] });
  });

  it("runs a query", async () => {
    await completedTimestamps(mockClient);
    expect(mockClient.query).to.have.been.calledWithMatch(/SELECT.*FROM\s+migrations/i);
  });

  it("returns the completed timestamps", async () => {
    let timestamps = await completedTimestamps(mockClient);
    expect(timestamps).to.have.members([ timestamp, '20181005000000' ]);
  });
});

describe("migrateUp", () => {

  it("begins a transaction", async () => {
    await migrateUp(mockClient, { sql, timestamp });
    expect(mockClient.query).to.have.been.calledWithMatch(/BEGIN/i);
  });

  it("runs the provided SQL", async () => {
    await migrateUp(mockClient, { sql, timestamp });
    expect(mockClient.query).to.have.been.calledWith(sql);
  });

  context("when running the SQL is sucessful", () => {

    it("adds the migration to the migrations table", async () => {
      await migrateUp(mockClient, { sql, timestamp });
      expect(mockClient.query).to.have.been.calledWithMatch(/INSERT\s+INTO\s+migrations/i);
    });

    it("commits the transaction", async () => {
      await migrateUp(mockClient, { sql, timestamp });
      expect(mockClient.query).to.have.been.calledWithMatch(/COMMIT/i);
    });
  });

  context("when running the SQL results in an error", () => {
    beforeEach(() => { mockClient.query.returns(Promise.reject(error)); });

    it("rolls back the transaction", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).to.have.been.calledWithMatch(/ROLLBACK/i);
    });

    it("does not add the migration to the migrations table", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).not.to.have.been.calledWithMatch(/INSERT\s+INTO\s+migrations/i);
    });

    it("it does not commit the transaction", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).not.to.have.been.calledWithMatch(/COMMIT/i);
    });
  });
});

describe("migrateDown", () => {

  it("begins a transaction", async () => {
    await migrateDown(mockClient, { sql, timestamp });
    expect(mockClient.query).to.have.been.calledWithMatch(/BEGIN/i);
  });

  it("runs the provided SQL", async () => {
    await migrateDown(mockClient, { sql, timestamp });
    expect(mockClient.query).to.have.been.calledWith(sql);
  });

  context("when running the SQL is sucessful", () => {

    it("removes the migration from the migrations table", async () => {
      await migrateDown(mockClient, { sql, timestamp });
      expect(mockClient.query).to.have.been.calledWithMatch(/DELETE\s+FROM\s+migrations/i);
    });

    it("commits the transaction", async () => {
      await migrateDown(mockClient, { sql, timestamp });
      expect(mockClient.query).to.have.been.calledWithMatch(/COMMIT/i);
    });
  });

  context("when running the SQL results in an error", () => {
    beforeEach(() => { mockClient.query.returns(Promise.reject(error)); });

    it("rolls back the transaction", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).to.have.been.calledWithMatch(/ROLLBACK/i);
    });

    it("does not add the migration to the migrations table", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).not.to.have.been.calledWithMatch(/INSERT\s+INTO\s+migrations/i);
    });

    it("it does not commit the transaction", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).to.be.rejected;
      expect(mockClient.query).not.to.have.been.calledWithMatch(/COMMIT/i);
    });
  });
});
