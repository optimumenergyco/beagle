import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockDatabaseClient from '../helpers/create-mock-database-client.js';
import createMockLogger from '../helpers/create-mock-logger';

describe("status", () => {
  let status, MockDatabaseClient, readMigrationFilesStub, migrationsDirectory, databaseOptions;

  beforeEach(() => {
    readMigrationFilesStub = sinon.stub();
    MockDatabaseClient = createMockDatabaseClient();

    status = proxyquire('../../lib/commands/status', {
      '../database/database-client': { default: MockDatabaseClient },
      '../migrations/migration-files': { readMigrationFiles: readMigrationFilesStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await status(databaseOptions, migrationsDirectory);
    expect(MockDatabaseClient).to.have.been.calledWithNew;
  });

  it("reads the migration files", async () => {
    await status(databaseOptions, migrationsDirectory);
    expect(readMigrationFilesStub).to.have.been.calledWith(migrationsDirectory);
  });

  context("when the database is set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(true));

    it("fetches the completed timestamps", async () => {
      await status(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.completedTimestamps).to.have.been.called;
    });
  });

  context("when the database is not set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(false));

    it("does not fetch the completed timestamps", async () => {
      await status(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.completedTimestamps).not.to.have.been.called;
    });
  });
});
