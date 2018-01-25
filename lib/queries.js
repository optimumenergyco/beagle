const MIGRATION_TABLE = 'migrations';
const VERSION_COLUMN = 'version';

export async function migrationsTableExists(client) {
  let { rows } = await client.query(
    `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1);`,
    [ MIGRATION_TABLE ]
  );

  return rows[0].exists;
}

export async function createMigrationsTable(client) {
  await client.query(`CREATE TABLE ${ MIGRATION_TABLE } (${ VERSION_COLUMN } TEXT NOT NULL);`);
}

export async function readMigrations(client) {
  return (await client.query(`SELECT * FROM ${ MIGRATION_TABLE }`)).rows;
}

export async function createAndRunMigration(client, sql, version) {
  try {
    await client.query("BEGIN;");
    await client.query(sql);
    await client.query(`INSERT INTO ${ MIGRATION_TABLE } (version) VALUES ($1);`, [ version ]);
    await client.query("COMMIT;");
  }
  catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}

export async function rollbackAndRunMigration(client, sql, version) {
  try {
    await client.query("BEGIN;");
    await client.query(sql);
    await client.query(`DELETE FROM ${ MIGRATION_TABLE } WHERE version = $1`, [ version ]);
    await client.query("COMMIT;");
  }
  catch (error) {
    await client.query("ROLLBACK");
    throw error;
  }
}
