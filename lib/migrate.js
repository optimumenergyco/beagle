import * as _ from 'lodash';

import { connect } from './database-client';
import loadMigrations from './migration-files';

import {
  createMigrationsTable,
  migrationsTableExists,
  readMigrations,
  createAndRunMigration
} from './queries';

export default async function migrate(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
    }

    // Grab the completed migrations.
    let completedVersions = _.map(await readMigrations(client), 'version');

    // Filter the migrations and order them.
    let migrations = _.chain(await loadMigrations(migrationsDirectory))
      .filter({ direction: 'up' })
      .reject(({ version }) => _.includes(completedVersions, version))
      .sortBy('version')
      .value();

    // Run the migrations sequentially.
    for (let i = 0; i < migrations.length; i++) {
      let { sql, version } = migrations[i];
      await createAndRunMigration(client, sql, version);
    }
  });
}
