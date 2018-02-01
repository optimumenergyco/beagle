import { Client } from 'pg';
import ApplicationError from '../utilities/application-error';

export async function connect({ host, port, user, password, database }, callback) {
  let result;

  let client = new Client({ host, port, user, password, database });

  try {
    await client.connect();
    result = await callback(client);
    await client.end();
  }
  catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new ApplicationError("🤙  Could not connect to the database.");
    }

    throw error;
  }

  return result;
}
