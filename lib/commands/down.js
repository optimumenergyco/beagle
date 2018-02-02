import * as _ from 'lodash';

import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';
import { lastCompletedMigration } from '../migrations/migration-filters';

const NO_MIGRATIONS_MESSAGE = "👋  There are no completed migrations to roll back";

export default async function down(databaseOptions, migrationsDirectory) {
  let client = new DatabaseClient(databaseOptions);

  // Create the migrations table if it doesn't already exist.
  if (!await client.isSetUp()) {
    logger.notice(NO_MIGRATIONS_MESSAGE);
    return;
  }

  // Grab the migration data
  let migrations = await readMigrationFiles(migrationsDirectory);
  let completedTimestamps = await client.completedTimestamps();
  let migration = lastCompletedMigration(migrations, completedTimestamps);

  if (_.isNil(migration)) {
    logger.notice(NO_MIGRATIONS_MESSAGE);
    return;
  }

  // Roll back the migration
  await client.migrateDown(migration);
  logger.success(`👍  Rolled back migration: ${ migration.basename }`);
}
