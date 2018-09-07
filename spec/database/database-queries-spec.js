import {
  isSetUp,
  setUp,
  completedTimestamps,
  migrateUp,
  migrateDown
} from '../../lib/database/database-queries';

const sql = "-- Hello";
const timestamp = "19881005000000";
const dummyError = Object.freeze(new Error("DUMMY"));

const mockClient = {
  query: jest.fn()
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("isSetUp", () => {
  beforeEach(() => mockClient.query.mockReturnValue({ rows: [ { exists: true } ] }));

  it("queries the migration table", async () => {
    await isSetUp(mockClient);
    expect(mockClient.query).toHaveBeenCalledWithMatch(/SELECT\s+EXISTS/i);
  });

  describe("when the migrations table exists", () => {

    it("returns true", async () => {
      expect(await isSetUp(mockClient)).toBe(true);
    });
  });

  describe("when the migrations table does not exist", () => {
    beforeEach(() => mockClient.query.mockReturnValue({ rows: [ { exists: false } ] }));

    it("returns false", async () => {
      expect(await isSetUp(mockClient)).toBe(false);
    });
  });
});

describe("setUp", () => {

  it("runs a query to create the migrations table", async () => {
    await setUp(mockClient);
    expect(mockClient.query).toHaveBeenCalledWithMatch(/CREATE\s+TABLE\s+migrations/i);
  });
});

describe("completedTimestamps", () => {
  beforeEach(() => {
    mockClient.query.mockReturnValue({
      rows: [
        { timestamp },
        { timestamp: '20181005000000' }
      ]
    });
  });

  it("runs a query", async () => {
    await completedTimestamps(mockClient);
    expect(mockClient.query).toHaveBeenCalledWithMatch(/SELECT.*FROM\s+migrations/i);
  });

  it("returns the completed timestamps", async () => {
    let timestamps = await completedTimestamps(mockClient);
    expect(timestamps).toEqual([ timestamp, '20181005000000' ]);
  });
});

describe("migrateUp", () => {

  it("begins a transaction", async () => {
    await migrateUp(mockClient, { sql, timestamp });
    expect(mockClient.query.mock.calls[0][0]).toMatch(/BEGIN/i);
  });

  it("runs the provided SQL", async () => {
    await migrateUp(mockClient, { sql, timestamp });
    expect(mockClient.query.mock.calls[1][0]).toBe(sql);
  });

  describe("when running the SQL is sucessful", () => {

    it("adds the migration to the migrations table", async () => {
      await migrateUp(mockClient, { sql, timestamp });
      expect(mockClient.query.mock.calls[2][0])
        .toMatch(/INSERT\s+INTO\s+migrations/i);
    });

    it("commits the transaction", async () => {
      await migrateUp(mockClient, { sql, timestamp });
      expect(mockClient.query.mock.calls[3][0]).toMatch(/COMMIT/i);
    });
  });

  describe("when running the SQL results in an error", () => {
    beforeEach(() => { mockClient.query.mockReturnValue(Promise.reject(dummyError)); });

    it("rolls back the transaction", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls[1][0]).toMatch(/ROLLBACK/i);
    });

    it("does not add the migration to the migrations table", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls)
        .toSatisfyAll(call => !/INSERT\s+INTO\s+migrations/i.test(call[0]));
    });

    it("it does not commit the transaction", async () => {
      await expect(migrateUp(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls).toSatisfyAll(call => !/COMMIT/i.test(call[0]));
    });
  });
});

describe("migrateDown", () => {

  it("begins a transaction", async () => {
    await migrateDown(mockClient, { sql, timestamp });
    expect(mockClient.query.mock.calls[0][0]).toMatch(/BEGIN/i);
  });

  it("runs the provided SQL", async () => {
    await migrateDown(mockClient, { sql, timestamp });
    expect(mockClient.query.mock.calls[1][0]).toBe(sql);
  });

  describe("when running the SQL is sucessful", () => {

    it("removes the migration from the migrations table", async () => {
      await migrateDown(mockClient, { sql, timestamp });
      expect(mockClient.query.mock.calls[2][0]).toMatch(/DELETE\s+FROM\s+migrations/i);
    });

    it("commits the transaction", async () => {
      await migrateDown(mockClient, { sql, timestamp });
      expect(mockClient.query.mock.calls[3][0]).toMatch(/COMMIT/i);
    });
  });

  describe("when running the SQL results in an error", () => {
    beforeEach(() => { mockClient.query.mockReturnValue(Promise.reject(dummyError)); });

    it("rolls back the transaction", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls[1][0]).toMatch(/ROLLBACK/i);
    });

    it("does not add the migration to the migrations table", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls)
        .toSatisfyAll(call => !/INSERT\s+INTO\s+migrations/i.test(call[0]));
    });

    it("it does not commit the transaction", async () => {
      await expect(migrateDown(mockClient, { sql, timestamp })).rejects.toBe(dummyError);
      expect(mockClient.query.mock.calls).toSatisfyAll(call => !/COMMIT/i.test(call[0]));
    });
  });
});
