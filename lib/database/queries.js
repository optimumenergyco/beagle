import * as _ from 'lodash';

const MIGRATION_TABLE = 'migrations';
const TIMESTAMP_COLUMN = 'timestamp';

export async function migrationsTableExists(client) {
  let { rows } = await client.query(
    `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1);`,
    [ MIGRATION_TABLE ]
  );

  return rows[0].exists;
}

export async function createMigrationsTable(client) {
  await client.query(`CREATE TABLE ${ MIGRATION_TABLE } (${ TIMESTAMP_COLUMN } TEXT NOT NULL);`);
}

export async function readMigrations(client) {
  let { rows } = await client.query(`SELECT * FROM ${ MIGRATION_TABLE }`);
  return _.map(rows, 'timestamp');
}

export async function createAndRunMigration(client, sql, timestamp) {
  try {
    await client.query("BEGIN;");
    await client.query(sql);
    await client.query(
      `INSERT INTO ${ MIGRATION_TABLE } (${ TIMESTAMP_COLUMN }) VALUES ($1);`,
      [ timestamp ]
    );
    await client.query("COMMIT;");
  }
  catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function rollbackAndRunMigration(client, sql, timestamp) {
  try {
    await client.query("BEGIN;");
    await client.query(sql);
    await client.query(
      `DELETE FROM ${ MIGRATION_TABLE } WHERE ${ TIMESTAMP_COLUMN } = $1`,
      [ timestamp ]
    );
    await client.query("COMMIT;");
  }
  catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
