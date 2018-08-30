import * as _ from 'lodash';

import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { completedMigrations, pendingMigrations } from '../migrations/migration-filters';
import { readMigrationFiles } from '../migrations/migration-files';

function printMigrations(label, migrations) {
  logger.notice(`${ label }:`);

  if (_.isEmpty(migrations)) {
    logger.info('N/A');
  }
  else {
    _.map(migrations, 'basename').forEach(logger.info);
  }
}

export default async function status(databaseOptions, migrationsDirectory) {
  let client = new DatabaseClient(databaseOptions);

  // Grab the migraiton data
  let migrations = await readMigrationFiles(migrationsDirectory);

  let completedTimestamps = await client.isSetUp()
    ? await client.completedTimestamps()
    : [];

  printMigrations("Completed Migrations", completedMigrations(migrations, completedTimestamps));
  printMigrations("Pending Migrations", pendingMigrations(migrations, completedTimestamps));
}
