import * as _ from 'lodash';

import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';
import { nextPendingMigration } from '../migrations/migration-filters';

export default async function up(databaseOptions, migrationsDirectory) {
  let client = new DatabaseClient(databaseOptions);

  // Create the migrations table if it doesn't already exist.
  if (!await client.isSetUp()) {
    await client.setUp();
    logger.success('Created migrations table.');
  }

  // Grab the migration data
  let migrations = await readMigrationFiles(migrationsDirectory);
  let completedTimestamps = await client.completedTimestamps();
  let migration = nextPendingMigration(migrations, completedTimestamps);

  if (_.isNil(migration)) {
    logger.notice("There are no migrations to run. Your database is up-to-date");
    return;
  }

  // Run the migration
  await client.migrateUp(migration);
  logger.success(`Ran migration: ${ migration.basename }`);
}
