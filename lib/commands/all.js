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

import { pendingMigrations } from '../migrations/migration-filters';

export default async function all(databaseOptions, migrationsDirectory) {

  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
      logger.success('👌  Created migrations table.');
    }

    // Grab the migration data
    let migrations = await readMigrationFiles(migrationsDirectory);
    let completedTimestamps = await readMigrations(client);
    migrations = pendingMigrations(migrations, completedTimestamps);

    if (_.isEmpty(migrations)) {
      logger.error("🤘  There are no migrations to run. Your database is up-to-date");
      return;
    }

    // Run the migrations
    for (let i = 0; i < migrations.length; i++) {
      let { sql, timestamp, basename } = migrations[i];
      await createAndRunMigration(client, sql, timestamp);
      logger.success(`👍  Ran migration: ${ basename }`);
    }
  });
}
