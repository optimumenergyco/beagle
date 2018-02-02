import * as _ from 'lodash';

import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';
import { pendingMigrations } from '../migrations/migration-filters';

export default async function all(databaseOptions, migrationsDirectory) {
  let client = new DatabaseClient(databaseOptions);

  // Create the migrations table if it doesn't already exist.
  if (!await client.isSetUp()) {
    await client.setUp();
    logger.success('👌  Created migrations table.');
  }

  // Grab the migration data
  let migrations = await readMigrationFiles(migrationsDirectory);
  let completedTimestamps = await client.completedTimestamps();
  migrations = pendingMigrations(migrations, completedTimestamps);

  if (_.isEmpty(migrations)) {
    logger.error("🤘  There are no migrations to run. Your database is up-to-date");
    return;
  }

  // Run the migrations
  for (let i = 0; i < migrations.length; i++) {
    await client.migrateUp(migrations[i]);
    logger.success(`👍  Ran migration: ${ migrations[i].basename }`);
  }
}
