import DatabaseClient from '../../lib/database/database-client';
import { readMigrationFiles } from '../../lib/migrations/migration-files';
import up from "../../lib/commands/up";

jest.mock('../../lib/database/database-client');

// Mock migration files.
jest.mock('../../lib/migrations/migration-files');

describe("up", () => {
  let databaseOptions, migration, migrationsDirectory;

  beforeEach(() => {
    jest.resetAllMocks();

    migration = {
      direction: 'up',
      basename: '17760704000000-hello.sql',
      timestamp: '17760704000000'
    };

    databaseOptions = {};

    migrationsDirectory = "/tmp/migrations";

    readMigrationFiles.mockReturnValue([ migration ]);
  });

  it("creates a new client", async () => {
    await up(databaseOptions, migrationsDirectory);
    expect(DatabaseClient).toHaveBeenCalled();
  });

  describe("when the database is not set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(false));

    it("sets up the database", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.setUp).toHaveBeenCalled();
    });
  });

  describe("when the database is set up", () => {
    beforeEach(() => DatabaseClient.prototype.isSetUp.mockReturnValue(true));

    it("does not set up the database", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.setUp).not.toHaveBeenCalled();
    });
  });

  it("reads the migration files", async () => {
    await up(databaseOptions, migrationsDirectory);
    expect(readMigrationFiles).toHaveBeenCalledWith(migrationsDirectory);
  });

  describe("when there is a pending migration", () => {
    beforeEach(() => DatabaseClient.prototype.completedTimestamps.mockReturnValue([]));

    it("runs the pending migration", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateUp).toHaveBeenCalledWith(migration);
    });
  });

  describe("when there is not a pending migration", () => {
    beforeEach(() => {
      DatabaseClient.prototype.completedTimestamps.mockReturnValue([ '17760704000000' ]);
    });

    it("does not run a migration", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(DatabaseClient.prototype.migrateUp).not.toHaveBeenCalled();
    });
  });
});
