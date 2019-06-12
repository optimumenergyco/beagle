import { createMigrationFile } from "../../lib/migrations/migration-files";
import generate from "../../lib/commands/generate";

jest.mock("../../lib/database/database-client");

// Mock migration files.
jest.mock("../../lib/migrations/migration-files");

describe("generate", () => {
  let migrationsDirectory;

  beforeEach(() => {
    migrationsDirectory = "/tmp/migrations";
  });

  it("creates the up file", async () => {
    await generate(migrationsDirectory, "hello");
    expect(createMigrationFile).toHaveBeenCalledWith(
      migrationsDirectory,
      "hello",
      "up"
    );
  });

  it("creates the down file", async () => {
    await generate(migrationsDirectory, "hello");
    expect(createMigrationFile).toHaveBeenCalledWith(
      migrationsDirectory,
      "hello",
      "up"
    );
  });
});
