import DatabaseClient from '../../lib/database/database-client';
import { readMigrationFiles } from '../../lib/migrations/migration-files';
import all from "../../lib/commands/all";

jest.mock('../../lib/database/database-client');

// Suppress the logging.
jest.mock('../../lib/utilities/logger');

// Mock migration files.
jest.mock('../../lib/migrations/migration-files');

describe("all", () => {
  let databaseOptions, migrationsDirectory, migrations;

  beforeEach(() => {
    jest.resetAllMocks();

    migrations = [
      {
        direction: 'up',
        basename: '19880715000000-die-hard.sql',
        timestamp: '19880715000000'
      },
      {
        direction: 'up',
        basename: '19900629000000-die-hard-2.sql',
        timestamp: '19900629000000'
      }
    ];

    databaseOptions = {};

    migrationsDirectory = "/tmp/migrations";

    readMigrationFiles.mockReturnValue(migrations);
  });

  it("creates a new client", async () => {
    await all(databaseOptions, migrationsDirectory);
    expect(DatabaseClient).toHaveBeenCalled();
  });

  describe("when the database is not set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(Promise.resolve(false)));

    it("sets up the database", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.setUp)
        .toHaveBeenCalledAfter(DatabaseClient.prototype.isSetUp);
    });
  });

  describe("when the database is set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(Promise.resolve(true)));

    it("does not set up the database", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.setUp).not.toHaveBeenCalled();
    });
  });

  it("reads the migration files", async () => {
    await all(databaseOptions, migrationsDirectory);
    expect(readMigrationFiles).toHaveBeenCalledWith(migrationsDirectory);
  });

  describe("when there is a pending migration", () => {
    beforeEach(() => DatabaseClient.prototype.completedTimestamps.mockReturnValue([]));

    it("runs the pending migration", async () => {
      await all(databaseOptions, migrationsDirectory);
      // All just calls Up multiple times.
      expect(DatabaseClient.prototype.migrateUp.mock.calls.length).toBe(2);
    });
  });

  describe("when there is not a pending migration", () => {
    beforeEach(() => {
      DatabaseClient.prototype.completedTimestamps.mockReturnValue([
        '19880715000000',
        '19900629000000'
      ]);
    });

    it("does not run a migration", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateUp).not.toHaveBeenCalled();
    });
  });
});
