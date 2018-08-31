import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';

export default async function command(databaseOptions, migrationsDirectory, migrationsAction) {
  let client = new DatabaseClient(databaseOptions);

  // Create the migrations table if it doesn't already exist.
  if (!await client.isSetUp()) {
    await client.setUp();
    logger.success('Created migrations table.');
  }

  // Grab the migration data
  let migrations = await readMigrationFiles(migrationsDirectory);
  // Execute the migrations action
  await migrationsAction(client, migrations);
}
