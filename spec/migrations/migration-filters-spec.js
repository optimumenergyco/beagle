import {
  pendingMigrations,
  completedMigrations,
  nextPendingMigration,
  lastCompletedMigration
} from '../../lib/migrations/migration-filters';

let migrations, timestamps;

beforeEach(() => {
  migrations = [
    { direction: 'up', timestamp: '20181005000000' },
    { direction: 'up', timestamp: '19881005000000' },
    { direction: 'down', timestamp: '20181005000000' },
    { direction: 'down', timestamp: '19881005000000' }
  ];

  timestamps = [
    migrations[0].timestamp,
    migrations[1].timestamp
  ];
});

describe("pendingMigrations", () => {

  describe("when all of the migrations are pending", () => {

    it("returns the pending migrations sorted by timestamp", () => {
      expect(pendingMigrations(migrations, [])).toEqual([ migrations[1], migrations[0] ]);
    });
  });

  describe("when some of the migrations are pending", () => {

    it("returns the pending migrations sorted by timestamp", () => {
      expect(pendingMigrations(migrations, [ timestamps[0] ])).toEqual([ migrations[1] ]);
    });
  });

  describe("when none of the migrations are pending", () => {

    it("returns an empty array", () => {
      expect(pendingMigrations(migrations, timestamps)).toEqual([]);
    });
  });
});

describe("completedMigrations", () => {

  describe("when none of the migrations have been completed", () => {

    it("returns an empty array", () => {
      expect(completedMigrations(migrations, [])).toEqual([]);
    });
  });

  describe("when some of the migrations have been completed", () => {

    it("returns the completed migrations sorted by timestamp", () => {
      expect(completedMigrations(migrations, [ timestamps[0] ])).toEqual([ migrations[2] ]);
    });
  });

  describe("when all of the migrations have been completd", () => {

    it("returns the completed migrations sorted by timestamp", () => {
      expect(completedMigrations(migrations, timestamps)).toEqual([ migrations[3], migrations[2] ]);
    });
  });
});

describe("nextPendingMigration", () => {

  describe("when there are no pending migrations", () => {

    it("returns an empty array", () => {
      expect(nextPendingMigration(migrations, timestamps)).toBeUndefined;
    });
  });

  describe("when there are pending migrations", () => {

    it("returns the pending migration when the earliest timestamp", () => {
      expect(nextPendingMigration(migrations, [])).toEqual(migrations[1]);
    });
  });
});

describe("lastCompletedMigration", () => {

  describe("when there are no completed migrations", () => {

    it("returns an empty array", () => {
      expect(lastCompletedMigration(migrations, [])).toBeUndefined;
    });
  });

  describe("when there are pending migrations", () => {

    it("returns the completed migration when the latest timestamp", () => {
      expect(lastCompletedMigration(migrations, timestamps)).toEqual(migrations[2]);
    });
  });
});
