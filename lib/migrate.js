import { connect } from './database_client';
import { migrationsTableExists } from './queries';

export default async function migrate(databaseOptions) {
  return connect(databaseOptions, async (client) => {
    await migrationsTableExists(client);
  });
}
