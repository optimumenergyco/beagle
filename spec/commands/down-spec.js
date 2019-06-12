import DatabaseClient from "../../lib/database/database-client";
import { readMigrationFiles } from "../../lib/migrations/migration-files";
import down from "../../lib/commands/down";

jest.mock("../../lib/database/database-client");

// Mock migration files.
jest.mock("../../lib/migrations/migration-files");

describe("down", () => {
  let databaseOptions, migrationsDirectory, migration;

  beforeEach(() => {
    jest.resetAllMocks();

    migration = {
      direction: "down",
      basename: "17760704000000-hello.sql",
      timestamp: "17760704000000"
    };

    databaseOptions = {};

    migrationsDirectory = "/tmp/migrations";

    readMigrationFiles.mockReturnValue([ migration ]);
  });

  it("creates a new client", async () => {
    await down(databaseOptions, migrationsDirectory);
    expect(DatabaseClient).toHaveBeenCalled();
  });

  describe("when the database is not set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(false));

    it("does not roll back a migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateDown).not.toHaveBeenCalled();
    });
  });

  it("reads the migration files", async () => {
    await down(databaseOptions, migrationsDirectory);
    expect(readMigrationFiles).toHaveBeenCalledWith(migrationsDirectory);
  });

  describe("when there is a completed migration", () => {
    beforeEach(() => {
      DatabaseClient.prototype.completedTimestamps.mockReturnValue([ "17760704000000" ]);
    });

    it("runs the pending migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateDown).toHaveBeenCalledWith(migration);
    });
  });

  describe("when there is not a completed migration", () => {
    beforeEach(() => DatabaseClient.prototype.completedTimestamps.mockReturnValue([]));

    it("does not run a migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateDown).not.toHaveBeenCalled();
    });
  });
});
