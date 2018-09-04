import _ from 'lodash';

import logger from '../utilities/logger';
import { pendingMigrations } from '../migrations/migration-filters';
import executeMigrationsAction from './execute-migrations-action';
import up from './up';

export default async function all(databaseOptions, migrationsDirectory) {

  let upMigrations =
    await executeMigrationsAction(
      databaseOptions,
      migrationsDirectory,
      async (client, migrations) => {
        let completedTimestamps = await client.completedTimestamps();
        migrations = pendingMigrations(migrations, completedTimestamps);

        if (_.isEmpty(migrations)) {
          logger.notice("There are no migrations to run. Your database is up-to-date");
          return [];
        }
        return migrations;
      });

  // Run the migrations
  for (let i = 0; i < upMigrations.length; i++) {
    await up(databaseOptions, migrationsDirectory);
  }
}
