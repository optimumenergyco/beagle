import proxyquire from 'proxyquire';
import sinon from 'sinon';
import { expect } from 'chai';

import createMockLogger from '../helpers/create-mock-logger';

describe("generate", () => {
  let generate, createMigrationFileStub, migrationsDirectory;

  beforeEach(() => {
    createMigrationFileStub = sinon.stub();

    generate = proxyquire('../../lib/commands/generate', {
      '../migrations/migration-files': { createMigrationFile: createMigrationFileStub },
      '../utilities/logger': { default: createMockLogger() }
    }).default;

    migrationsDirectory = "/tmp/migrations";
  });

  it("creates the up file", async () => {
    await generate(migrationsDirectory, 'hello');
    expect(createMigrationFileStub).to.have.been.calledWith(
      migrationsDirectory,
      'hello',
      'up'
    );
  });

  it("creates the down file", async () => {
    await generate(migrationsDirectory, 'hello');
    expect(createMigrationFileStub).to.have.been.calledWith(
      migrationsDirectory,
      'hello',
      'up'
    );
  });
});
