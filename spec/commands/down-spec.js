import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockDatabaseClient from '../helpers/create-mock-database-client.js';
import createMockLogger from '../helpers/create-mock-logger';

describe("down", () => {
  let down, MockDatabaseClient, readMigrationFilesStub, migrationsDirectory, databaseOptions,
    migration;

  beforeEach(() => {
    readMigrationFilesStub = sinon.stub();
    MockDatabaseClient = createMockDatabaseClient();

    down = proxyquire('../../lib/commands/down', {
      '../database/database-client': { default: MockDatabaseClient },
      '../migrations/migration-files': { readMigrationFiles: readMigrationFilesStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

    migration = {
      direction: 'down',
      basename: '17760704000000-hello.sql',
      timestamp: '17760704000000'
    };

    readMigrationFilesStub.resolves([ migration ]);

    databaseOptions = {};
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates a new client", async () => {
    await down(databaseOptions, migrationsDirectory);
    expect(MockDatabaseClient).to.have.been.calledWithNew;
  });

  context("when the database is not set up", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.isSetUp.resolves(false));

    it("does not fetch the completed timestamps", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.completedTimestamps).to.not.have.been.called;
    });

    it("does not read the migration files", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(readMigrationFilesStub).to.not.have.been.called;
    });

    it("does not roll back a migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateDown).to.not.have.been.called;
    });
  });

  it("reads the migration files", async () => {
    await down(databaseOptions, migrationsDirectory);
    expect(readMigrationFilesStub).to.have.been.calledWith(migrationsDirectory);
  });

  context("when there is a completed migration", () => {
    beforeEach(() => {
      MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([ '17760704000000' ]);
    });

    it("runs the pending migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateDown).to.have.been.calledWith(migration);
    });
  });

  context("when there is not a completed migration", () => {
    beforeEach(() => MockDatabaseClient.mockDatabaseClient.completedTimestamps.resolves([]));

    it("does not run a migration", async () => {
      await down(databaseOptions, migrationsDirectory);
      expect(MockDatabaseClient.mockDatabaseClient.migrateDown).to.not.have.been.called;
    });
  });
});
