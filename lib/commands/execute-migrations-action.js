import DatabaseClient from '../database/database-client';
import logger from '../utilities/logger';
import { readMigrationFiles } from '../migrations/migration-files';

export default async function executeMigrationsAction(
  databaseOptions, migrationsDirectory, migrationsAction) {
  try {
    let client = new DatabaseClient(databaseOptions);

    // Create the migrations table if it doesn't already exist.
    if (!await client.isSetUp()) {
      await client.setUp();
      logger.success('Created migrations table.');
    }

    // Grab the migration data
    let migrations = await readMigrationFiles(migrationsDirectory);
    // Execute the migrations action
    return await migrationsAction(client, migrations);
  } catch (error) {
    logger.error("Failure during beagle setup");
    logger.error(error.message);
    process.exit(1);
  }
}
