import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockDatabaseClient from '../helpers/create-mock-database-client.js';
import createMockLogger from '../helpers/create-mock-logger';

describe("all", () => {
  let all, MockDatabaseClient, readMigrationFilesStub, migrationsDirectory, databaseOptions,
    migrations;

  beforeEach(() => {
    readMigrationFilesStub = sinon.stub();
    MockDatabaseClient = createMockDatabaseClient();

    all = proxyquire('../../lib/commands/all', {
      '../database/database-client': { default: MockDatabaseClient },
      '../migrations/migration-files': { readMigrationFiles: readMigrationFilesStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

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

    readMigrationFilesStub.resolves(migrations);

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await all(databaseOptions, migrationsDirectory);
    expect(MockDatabaseClient).to.have.been.calledWithNew;
  });

  context("when the database is not set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(false));

    it("sets up the database", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.setUp).to.have.been.called;
    });
  });

  context("when the database is set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(true));

    it("does not set up the database", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.setUp).to.not.have.been.called;
    });
  });

  it("reads the migration files", async () => {
    await all(databaseOptions, migrationsDirectory);
    expect(readMigrationFilesStub).to.have.been.calledWith(migrationsDirectory);
  });

  context("when there is a pending migration", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([]));

    it("runs the pending migration", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateUp)
        .to.have.been.calledWith(migrations[0]);
      expect(MockDatabaseClient.mockDatabaseClient.migrateUp)
        .to.have.been.calledWith(migrations[1]);
    });
  });

  context("when there is not a pending migration", () => {
    beforeEach(() => {
      MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([
        '19880715000000',
        '19900629000000'
      ]);
    });

    it("does not run a migration", async () => {
      await all(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateUp).to.not.have.been.called;
    });
  });
});
