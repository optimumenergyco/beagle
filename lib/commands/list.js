import * as _ from 'lodash';

import logger from '../utilities/logger';
import { completedMigrations, pendingMigrations } from '../migrations/migration-filters';
import { connect } from '../database/client';
import { migrationsTableExists, readMigrations } from '../database/queries';
import { readMigrationFiles } from '../migrations/migration-files';

function printMigrations(label, migrations) {
  logger.notice(`\n${ label }:\n`);

  if (_.isEmpty(migrations)) {
    logger.info('N/A');
  }
  else {
    _.map(migrations, 'basename').forEach(logger.info);
  }

}

export default async function list(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Grab the migraiton data
    let migrations = await readMigrationFiles(migrationsDirectory);

    let completedTimestamps = await migrationsTableExists(client)
      ? await readMigrations(client)
      : [];

    printMigrations("Completed Migrations", completedMigrations(migrations, completedTimestamps));
    printMigrations("Pending Migrations", pendingMigrations(migrations, completedTimestamps));
  });
}
