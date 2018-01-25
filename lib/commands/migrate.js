import * as _ from 'lodash';

import { connect } from '../database/client';
import loadMigrations from '../migrations/files';
import logger from '../utilities/logger';

import {
  createMigrationsTable,
  migrationsTableExists,
  readMigrations,
  createAndRunMigration
} from '../database/queries';

export default async function migrate(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
      logger.success('👌  Created migrations table.');
    }

    // Grab the completed migrations.
    let completedVersions = _.map(await readMigrations(client), 'version');

    // Filter the migrations and order them.
    let migrations = _.chain(await loadMigrations(migrationsDirectory))
      .filter({ direction: 'up' })
      .reject(({ version }) => _.includes(completedVersions, version))
      .sortBy('version')
      .value();

    if (migrations.length === 0) {
      logger.info("🤘  There are no migrations to run. Your database is up-to-date");
    }

    // Run the migrations sequentially.
    for (let i = 0; i < migrations.length; i++) {
      let { sql, version, basename } = migrations[i];

      try {
        await createAndRunMigration(client, sql, version);
        logger.success(`👍  Ran migration: ${ basename }`);
      }
      catch (error) {
        logger.error(`👎  There was a problem running your migration: ${ basename }`);
      }
    }
  });
}
