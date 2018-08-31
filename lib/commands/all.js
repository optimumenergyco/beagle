import _ from 'lodash';

import logger from '../utilities/logger';
import { pendingMigrations } from '../migrations/migration-filters';
import command from './command';

export default async function all(databaseOptions, migrationsDirectory) {
  command(databaseOptions, migrationsDirectory, async (client, migrations) => {
    let completedTimestamps = await client.completedTimestamps();
    migrations = pendingMigrations(migrations, completedTimestamps);

    if (_.isEmpty(migrations)) {
      logger.notice("There are no migrations to run. Your database is up-to-date");
      return;
    }

    // Run the migrations
    for (let i = 0; i < migrations.length; i++) {
      await client.migrateUp(migrations[i]);
      logger.success(`Ran migration: ${ migrations[i].basename }`);
    }
  });
}
