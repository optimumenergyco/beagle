import _ from 'lodash';

import logger from '../utilities/logger';
import { lastCompletedMigration } from '../migrations/migration-filters';
import executeMigrationsAction from './execute-migrations-action';

const NO_MIGRATIONS_MESSAGE = "There are no completed migrations to roll back";

export default async function down(databaseOptions, migrationsDirectory) {
  await executeMigrationsAction(
    databaseOptions,
    migrationsDirectory,
    async (client, migrations) => {
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
      } catch (error) {
        logger.error(`Failed to run down migration: ${migration.basename}`);
        logger.logParseException(error, migration);
        process.exit(1);
      }
    });
}
