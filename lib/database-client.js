import { Client } from 'pg';

export async function connect({ host, port, user, password, database }, callback) {
  let client = new Client({ host, port, user, password, database });

  await client.connect();
  await callback(client);
  await client.end();
}
