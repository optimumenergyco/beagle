import * as _ from 'lodash';

import { connect } from '../database/client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';
import { lastCompletedMigration } from '../migrations/migration-filters';

import {
  migrationsTableExists,
  readMigrations,
  rollbackAndRunMigration
} from '../database/queries';

const NO_MIGRATIONS_MESSAGE = "👋  There are no completed migrations to roll back";

export default async function down(databaseOptions, migrationsDirectory) {

  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      logger.notice(NO_MIGRATIONS_MESSAGE);
      return;
    }

    // Grab the migration data
    let migrations = await readMigrationFiles(migrationsDirectory);
    let completedTimestamps = await readMigrations(client);
    let migration = lastCompletedMigration(migrations, completedTimestamps);

    if (_.isNil(migration)) {
      logger.notice(NO_MIGRATIONS_MESSAGE);
      return;
    }

    await rollbackAndRunMigration(client, migration.sql, migration.timestamp);
    logger.success(`👍  Rolled back migration: ${ migration.basename }`);
  });
}
