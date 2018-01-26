import * as _ from 'lodash';
import { join, basename } from 'path';
import { glob, readFile, touchp } from '../utilities/file-system';

const MIGRATION_PATH_REGEX = /(\d{14})-(.*)-(up|down).sql$/;

function validateMigrationPath(path) {
  if (!MIGRATION_PATH_REGEX.test(path)) {
    throw new Error(
      `Your migration ${ basename(path) } much match the format <VERSION>-<NAME>-<up|down>.sql`
    );
  }
}

async function loadMigration(path) {
  let match = basename(path).match(/^(\d+)-(.*)-(up|down).sql$/);

  return {
    version: match[1],
    name: match[2],
    direction: match[3],
    path,
    basename: basename(path),
    sql: await readFile(path)
  };
}

function migrationPath(directory, name, direction) {
  name = _.kebabCase(name);

  let version = new Date()
    .toISOString()
    .replace(/\..+/, "")
    .replace(/\D/g, "");

  return join(directory, `${ version }-${ name }-${ direction }.sql`);
}

export async function readMigrationFiles(migrationsDirectory) {
  let paths = await glob(join(migrationsDirectory, "*.sql"));
  paths.forEach(validateMigrationPath);
  return Promise.all(_.map(paths, loadMigration));
}

export async function createMigrationFile(directory, name, direction) {
  let path = migrationPath(directory, name, direction);
  await touchp(path);
  return path;
}
