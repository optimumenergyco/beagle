import _ from "lodash";

import logger from "../utilities/logger";
import executeMigrationsAction from "./execute-migrations-action";
import { completedMigrations, pendingMigrations } from "../migrations/migration-filters";

function printMigrations(label, migrations) {
  logger.notice(`${ label }:`);

  if (_.isEmpty(migrations)) {
    logger.info("N/A");
  }
  else {
    _.map(migrations, "basename").forEach(logger.info);
  }
}

export default async function status(databaseOptions, migrationsDirectory) {
  await executeMigrationsAction(
    databaseOptions,
    migrationsDirectory,
    async (client, migrations) => {

      let completedTimestamps = await client.isSetUp()
        ? await client.completedTimestamps()
        : [];

      printMigrations("Completed Migrations", completedMigrations(migrations, completedTimestamps));
      printMigrations("Pending Migrations", pendingMigrations(migrations, completedTimestamps));
    }
  );
}

