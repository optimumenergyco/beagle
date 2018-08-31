import _ from 'lodash';

import logger from '../utilities/logger';
import { lastCompletedMigration } from '../migrations/migration-filters';
import command from './command';

const NO_MIGRATIONS_MESSAGE = "There are no completed migrations to roll back";

export default async function all(databaseOptions, migrationsDirectory) {
  command(databaseOptions, migrationsDirectory, async (client, migrations) => {
    let completedTimestamps = await client.completedTimestamps();
    let migration = lastCompletedMigration(migrations, completedTimestamps);

    if (_.isNil(migration)) {
      logger.notice(NO_MIGRATIONS_MESSAGE);
      return;
    }

    // Roll back the migration
    await client.migrateDown(migration);
    logger.success(`Rolled back migration: ${ migration.basename }`);
  });
}
