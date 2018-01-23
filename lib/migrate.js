import { connect } from './database_client';
import {
  createMigrationsTable,
  migrationsTableExists
} from './queries';

export default async function migrate(databaseOptions) {
  return connect(databaseOptions, async (client) => {

    // Create the migrations table if it doesn't already exist.
    if (!await migrationsTableExists(client)) {
      await createMigrationsTable(client);
    }
  });
}
