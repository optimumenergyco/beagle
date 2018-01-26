import * as _ from 'lodash';

import { connect } from '../database/client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';

import {
  createMigrationsTable,
  migrationsTableExists,
  createAndRunMigration,
  readMigrations
} from '../database/queries';

import { nextPendingMigration } from '../migrations/migration-filters';

export default async function up(databaseOptions, migrationsDirectory) {

  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
      logger.success('👌  Created migrations table.');
    }

    // Grab the migration data
    let migrations = await readMigrationFiles(migrationsDirectory);
    let completedTimestamps = await readMigrations(client);
    let migration = nextPendingMigration(migrations, completedTimestamps);

    if (_.isNil(migration)) {
      logger.error("🤘  There are no migrations to run. Your database is up-to-date");
      return;
    }

    // Run the migration
    await createAndRunMigration(client, migration.sql, migration.timestamp);
    logger.success(`👍  Ran migration: ${ migration.basename }`);
  });
}
