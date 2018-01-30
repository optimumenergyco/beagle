import * as _ from 'lodash';
import { join, basename } from 'path';
import { glob, readFile, touchp } from '../utilities/file-system';
import ValidationError from '../utilities/validation-error';

const MIGRATION_PATH_REGEX = /(\d{14})-(.*)-(up|down).sql$/;

export function migrationPath(directory, name, direction) {
  name = _.kebabCase(name);

  let timestamp = new Date()
    .toISOString()
    .replace(/\..+/, "")
    .replace(/\D/g, "");

  return join(directory, `${ timestamp }-${ name }-${ direction }.sql`);
}

export async function createMigrationFile(directory, name, direction) {
  let path = migrationPath(directory, name, direction);
  await touchp(path);
  return path;
}

export async function readMigrationFile(path) {
  if (!MIGRATION_PATH_REGEX.test(path)) {
    throw new ValidationError(
      `Your migration ${ basename(path) } much match the format <TIMESTAMP>-<NAME>-<up|down>.sql`
    );
  }

  let match = basename(path).match(/^(\d+)-(.*)-(up|down).sql$/);

  return {
    timestamp: match[1],
    name: match[2],
    direction: match[3],
    path,
    basename: basename(path),
    sql: await readFile(path)
  };
}

export async function readMigrationFiles(migrationsDirectory) {
  let paths = await glob(join(migrationsDirectory, "*.sql"));
  return Promise.all(_.map(paths, readMigrationFile));
}
