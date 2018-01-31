import { expect } from 'chai';

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

  context("when all of the migrations are pending", () => {

    it("returns the pending migrations sorted by timestamp", () => {
      expect(pendingMigrations(migrations, [])).to.eql([ migrations[1], migrations[0] ]);
    });
  });

  context("when some of the migrations are pending", () => {

    it("returns the pending migrations sorted by timestamp", () => {
      expect(pendingMigrations(migrations, [ timestamps[0] ])).to.eql([ migrations[1] ]);
    });
  });

  context("when none of the migrations are pending", () => {

    it("returns an empty array", () => {
      expect(pendingMigrations(migrations, timestamps)).to.eql([]);
    });
  });
});

describe("completedMigrations", () => {

  context("when none of the migrations have been completed", () => {

    it("returns an empty array", () => {
      expect(completedMigrations(migrations, [])).to.eql([]);
    });
  });

  context("when some of the migrations have been completed", () => {

    it("returns the completed migrations sorted by timestamp", () => {
      expect(completedMigrations(migrations, [ timestamps[0] ])).to.eql([ migrations[2] ]);
    });
  });

  context("when all of the migrations have been completd", () => {

    it("returns the completed migrations sorted by timestamp", () => {
      expect(completedMigrations(migrations, timestamps)).to.eql([ migrations[3], migrations[2] ]);
    });
  });
});

describe("nextPendingMigration", () => {

  context("when there are no pending migrations", () => {

    it("returns an empty array", () => {
      expect(nextPendingMigration(migrations, timestamps)).to.be.undefined;
    });
  });

  context("when there are pending migrations", () => {

    it("returns the pending migration when the earliest timestamp", () => {
      expect(nextPendingMigration(migrations, [])).to.eq(migrations[1]);
    });
  });
});

describe("lastCompletedMigration", () => {

  context("when there are no completed migrations", () => {

    it("returns an empty array", () => {
      expect(lastCompletedMigration(migrations, [])).to.be.undefined;
    });
  });

  context("when there are pending migrations", () => {

    it("returns the completed migration when the latest timestamp", () => {
      expect(lastCompletedMigration(migrations, timestamps)).to.eq(migrations[2]);
    });
  });
});
