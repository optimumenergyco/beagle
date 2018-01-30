import fs from 'fs';
import { expect } from 'chai';

import ValidationError from '../../lib/utilities/validation-error';

import {
  migrationPath,
  createMigrationFile,
  readMigrationFile,
  readMigrationFiles
} from '../../lib/migrations/migration-files';

describe("migrationPath", () => {

  it('returns the migration path', () => {
    expect(migrationPath("/tmp", "hello", "up")).to.match(/^\/tmp\/\d{14}-hello-up\.sql$/);
  });
});

describe("createMigrationFile", () => {

  it("creates the file", async () => {
    let path = await createMigrationFile("/tmp/test", "hello", "up");
    fs.readFileSync(path, "utf8");
  });
});

describe("readMigrationFile", () => {
  let path;

  context("when the migration path does not have a timestamp", () => {
    beforeEach(() => path = "/tmp/hello.sql");

    it("throws a validation error", () => {
      return expect(readMigrationFile(path)).to.be.rejectedWith(ValidationError);
    });
  });

  context("when the migration path does not have a name", () => {
    beforeEach(() => path = "/tmp/19881005000000-down.sql");

    it("throws a validation error", () => {
      return expect(readMigrationFile(path)).to.be.rejectedWith(ValidationError);
    });
  });

  context("when the migration path does not have a direction", () => {
    beforeEach(() => path = "/tmp/19881005000000-hello.sql");

    it("throws a validation error", () => {
      return expect(readMigrationFile(path)).to.be.rejectedWith(ValidationError);
    });
  });

  context("when the migration path does not have an SQL extension", () => {
    beforeEach(() => path = "/tmp/19881005000000-hello-down");

    it("throws a validation error", () => {
      return expect(readMigrationFile(path)).to.be.rejectedWith(ValidationError);
    });
  });

  context("when the file does not exist", () => {

    it("throws an error", () => {
      return expect(readMigrationFile(path)).to.be.rejectedWith(Error);
    });
  });

  context("when the file exists and the path is valid", () => {
    let migration;

    beforeEach(async () => {
      path = "/tmp/19881005000000-hello-up.sql";
      fs.writeFileSync(path, "-- SQL");
      migration = await readMigrationFile(path);
    });

    afterEach(() => {
      fs.unlinkSync(path);
    });

    it("returns an object with the migration's timestamp", () => {
      expect(migration.timestamp).to.eq("19881005000000");
    });

    it("returns an object with the migration's name", () => {
      expect(migration.name).to.eq("hello");
    });

    it("returns an object with the migration's direction", () => {
      expect(migration.direction).to.eq("up");
    });

    it("returns an object with the migration's basename", () => {
      expect(migration.basename).to.eq("19881005000000-hello-up.sql");
    });

    it("returns an object with the migration's sql", () => {
      expect(migration.sql).to.eq("-- SQL");
    });
  });
});

describe("readMigrationFiles", () => {
  let migrationsDirectory;

  beforeEach(() => {
    migrationsDirectory = `/tmp/${ new Date().toISOString().replace(/\D/g, '-') }trek`;

    fs.mkdirSync(migrationsDirectory);
    fs.writeFileSync(`${ migrationsDirectory }/19881005000000-hello-up.sql`, "-- Hello");
    fs.writeFileSync(`${ migrationsDirectory }/19881005000000-hello-down.sql`, "-- Thirty");
  });

  afterEach(() => {
    fs.unlinkSync(`${ migrationsDirectory }/19881005000000-hello-up.sql`);
    fs.unlinkSync(`${ migrationsDirectory }/19881005000000-hello-down.sql`);
    fs.rmdirSync(migrationsDirectory);
  });

  it("reads the migration files", async () => {
    let migrations = await readMigrationFiles(migrationsDirectory);

    expect(migrations.map(migration => migration.basename)).to.have.members([
      '19881005000000-hello-up.sql',
      '19881005000000-hello-down.sql'
    ]);
  });
});
