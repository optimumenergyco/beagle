import * as _ from 'lodash';

import { connect } from '../database/client';
import loadMigrations from '../migrations/files';
import logger from '../utilities/logger';

import {
  migrationsTableExists,
  readMigrations,
  rollbackAndRunMigration
} from '../database/queries';

const NO_MIGRATIONS_MESSAGE = "🖐  There are no migrations to rollback.";

export default async function rollback(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      logger.info(NO_MIGRATIONS_MESSAGE);
    }

    // Grab the completed migrations.
    let completedVersions = _.map(await readMigrations(client), 'version');

    // Grab the last migration to run
    let migration = _.chain(await loadMigrations(migrationsDirectory))
      .filter({ direction: 'down' })
      .filter(({ version }) => _.includes(completedVersions, version))
      .sortBy('version')
      .last()
      .value();

    if (_.isNil(migration)) {
      logger.info(NO_MIGRATIONS_MESSAGE);
      return;
    }

    // Roll back the latest migration
    try {
      await rollbackAndRunMigration(client, migration.sql, migration.version);
      logger.success(`👍  Rolled back migration: ${ migration.basename }`);
    }
    catch (error) {
      logger.error(`👎  There was a problem rolling back your migration: ${ migration.basename }`);
    }
  });
}
