import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockDatabaseClient from '../helpers/create-mock-database-client.js';
import createMockLogger from '../helpers/create-mock-logger';

describe("up", () => {
  let up, MockDatabaseClient, readMigrationFilesStub, migrationsDirectory, databaseOptions,
    migration;

  beforeEach(() => {
    readMigrationFilesStub = sinon.stub();
    MockDatabaseClient = createMockDatabaseClient();

    up = proxyquire('../../lib/commands/up', {
      '../database/database-client': { default: MockDatabaseClient },
      '../migrations/migration-files': { readMigrationFiles: readMigrationFilesStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

    migration = {
      direction: 'up',
      basename: '17760704000000-hello.sql',
      timestamp: '17760704000000'
    };

    readMigrationFilesStub.resolves([ migration ]);

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await up(databaseOptions, migrationsDirectory);
    expect(MockDatabaseClient).to.have.been.calledWithNew;
  });

  context("when the database is not set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(false));

    it("sets up the database", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.setUp).to.have.been.called;
    });
  });

  context("when the database is set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(true));

    it("does not set up the database", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.setUp).to.not.have.been.called;
    });
  });

  it("reads the migration files", async () => {
    await up(databaseOptions, migrationsDirectory);
    expect(readMigrationFilesStub).to.have.been.calledWith(migrationsDirectory);
  });

  context("when there is a pending migration", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([]));

    it("runs the pending migration", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateUp).to.have.been.calledWith(migration);
    });
  });

  context("when there is not a pending migration", () => {
    beforeEach(() => {
      MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([ '17760704000000' ]);
    });

    it("does not run a migration", async () => {
      await up(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateUp).to.not.have.been.called;
    });
  });
});
