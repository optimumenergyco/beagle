import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockDatabaseClient from '../helpers/create-mock-database-client.js';
import createMockLogger from '../helpers/create-mock-logger';

describe("list", () => {
  let list, MockDatabaseClient, readMigrationFilesStub, migrationsDirectory, databaseOptions;

  beforeEach(() => {
    readMigrationFilesStub = sinon.stub();
    MockDatabaseClient = createMockDatabaseClient();

    list = proxyquire('../../lib/commands/list', {
      '../database/database-client': { default: MockDatabaseClient },
      '../migrations/migration-files': { readMigrationFiles: readMigrationFilesStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await list(databaseOptions, migrationsDirectory);
    expect(MockDatabaseClient).to.have.been.calledWithNew;
  });

  it("reads the migration files", async () => {
    await list(databaseOptions, migrationsDirectory);
    expect(readMigrationFilesStub).to.have.been.calledWith(migrationsDirectory);
  });

  context("when the database is set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(true));

    it("fetches the completed timestamps", async () => {
      await list(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.completedTimestamps).to.have.been.called;
    });
  });

  context("when the database is not set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(false));

    it("does not fetch the completed timestamps", async () => {
      await list(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.completedTimestamps).not.to.have.been.called;
    });
  });
});
