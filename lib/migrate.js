import { connect } from './database_client';
import readMigrations from './migration-files';

import {
  createMigrationsTable,
  migrationsTableExists
} from './queries';

export default async function migrate(databaseOptions, migrationsDirectory) {
  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
    }

    // Read all of the data for the migration files
    let migrations = await readMigrations(migrationsDirectory);
  });
}
