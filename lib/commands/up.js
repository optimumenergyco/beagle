import _ from "lodash";

import logger from "../utilities/logger";
import { nextPendingMigration } from "../migrations/migration-filters";
import executeMigrationsAction from "./execute-migrations-action";

export default async function up(databaseOptions, migrationsDirectory) {
  await executeMigrationsAction(
    databaseOptions,
    migrationsDirectory,
    async (client, migrations) => {

      let completedTimestamps = await client.completedTimestamps();
      let migration = nextPendingMigration(migrations, completedTimestamps);

      if (_.isNil(migration)) {
        logger.notice("There are no migrations to run. Your database is up-to-date");
        return;
      }

      // Run the migration
      try {
        await client.migrateUp(migration);
        logger.success(`Ran up migration: ${ migration.basename }`);
      } catch (error) {
        logger.error(`Failed to run up migration: ${ migration.basename }`);
        logger.logParseException(error, migration);
        process.exit(1);
      }
    }
  );
}

