import { Client } from 'pg';
import logger from '../utilities/logger';

export async function connect({ host, port, user, password, database }, callback) {
  let client = new Client({ host, port, user, password, database });

  try {
    await client.connect();
    await callback(client);
    await client.end();
  }
  catch (error) {
    if (error.code === 'ECONNREFUSED') {
      logger.error("🤙  Could not connect to database.");
      return;
    }

    throw error;
  }
}
