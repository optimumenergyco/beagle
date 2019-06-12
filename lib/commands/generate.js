import logger from "../utilities/logger";
import { createMigrationFile } from "../migrations/migration-files";

export default async function generate(migrationsDirectory, name) {

  [ "up", "down" ].forEach(async (direction) => {
    let path = await createMigrationFile(migrationsDirectory, name, direction);
    logger.success(`Created file: ${ path }`);
  });
}
