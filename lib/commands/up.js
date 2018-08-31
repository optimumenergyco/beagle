import _ from 'lodash';

import logger from '../utilities/logger';
import { nextPendingMigration } from '../migrations/migration-filters';
import command from './command';

export default async function all(databaseOptions, migrationsDirectory) {
  await command(databaseOptions, migrationsDirectory, async (client, migrations) => {

    let completedTimestamps = await client.completedTimestamps();
    let migration = nextPendingMigration(migrations, completedTimestamps);

    if (_.isNil(migration)) {
      logger.notice("There are no migrations to run. Your database is up-to-date");
      return;
    }

    // Run the migration
    await client.migrateUp(migration);
    logger.success(`Ran migration: ${ migration.basename }`);
  });
}

