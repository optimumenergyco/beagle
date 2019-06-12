import DatabaseClient from "../../lib/database/database-client";
import { readMigrationFiles } from "../../lib/migrations/migration-files";
import status from "../../lib/commands/status";

jest.mock("../../lib/database/database-client");

// Mock migration files.
jest.mock("../../lib/migrations/migration-files");

describe("status", () => {
  let migrationsDirectory, databaseOptions;

  beforeEach(() => {

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await status(databaseOptions, migrationsDirectory);
    expect(DatabaseClient).toHaveBeenCalled();
  });

  it("reads the migration files", async () => {
    await status(databaseOptions, migrationsDirectory);
    expect(readMigrationFiles).toHaveBeenCalledWith(migrationsDirectory);
  });

  describe("when the database is set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(true));

    it("fetches the completed timestamps", async () => {
      await status(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.completedTimestamps).toHaveBeenCalled();
    });
  });

  describe("when the database is not set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(false));

    it("sets up the database", async () => {
      await status(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.setUp).toHaveBeenCalled();
    });

    it("fetches the completed timestamps", async () => {
      await status(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.completedTimestamps).toHaveBeenCalled();
    });
  });
});
