const MIGRATION_TABLE = 'migrations';

export async function migrationsTableExists(client) {
  let { rows } = await client.query(
    `
      SELECT EXISTS (
        SELECT 1
        FROM   information_schema.tables
        WHERE  table_schema = $1
        AND    table_name = $2
      );
    `,
    [ 'schema_name', MIGRATION_TABLE ]
  );

  return rows[0].exists;
}
