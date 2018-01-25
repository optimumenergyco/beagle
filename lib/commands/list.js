import * as _ from 'lodash';

import { connect } from '../database/client';
import loadMigrations from '../migrations/files';
import logger from '../utilities/logger';
import { migrationsTableExists, readMigrations } from '../database/queries';

function printMigrations(label, migrations) {
  if (_.isEmpty(migrations)) { return; }

  logger.info(`\n${ label }:\n`);

  _.forEach(migrations, ({ basename }) => logger.info(basename));
}

export default async function list(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Grab the migraiton files
    let migrations = await loadMigrations(migrationsDirectory);

    // Grab the completed migrations
    let completedVersions = await migrationsTableExists(client)
      ? _.map(await readMigrations(client), 'version')
      : [];

    // Filter the migrations
    let migrationsToRun = _.chain(migrations)
      .filter({ direction: 'up' })
      .reject(({ version }) => _.includes(completedVersions, version))
      .sortBy('version')
      .value();

    let completedMigrations = _.chain(migrations)
      .filter({ direction: 'down' })
      .filter(({ version }) => _.includes(completedVersions, version))
      .sortBy('version')
      .value();

    printMigrations("Completed Migrations", completedMigrations);
    printMigrations("Migrations to Run", migrationsToRun);
  });
}
