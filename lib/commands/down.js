import _ from 'lodash';

import logger from '../utilities/logger';
import { lastCompletedMigration } from '../migrations/migration-filters';
import command from './command';

const NO_MIGRATIONS_MESSAGE = "There are no completed migrations to roll back";

export default async function down(databaseOptions, migrationsDirectory) {
  command(databaseOptions, migrationsDirectory, async (client, migrations) => {
    let completedTimestamps = await client.completedTimestamps();
    let migration = lastCompletedMigration(migrations, completedTimestamps);

    if (_.isNil(migration)) {
      logger.notice(NO_MIGRATIONS_MESSAGE);
      return;
    }

    // Run the down migration
    try {
      await client.migrateDown(migration);
      logger.success(`Ran down migration: ${migration.basename}`);
    } catch (ex) {
      logger.error(`Failed to run down migration: ${migration.basename}`);
      logger.logParseException(ex, migration);
      process.exit(1);
    }
  });
}
