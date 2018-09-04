import * as _ from 'lodash';
import { connect } from './database-connect';

import * as queries from './database-queries';

export default class DatabaseClient {

  constructor(connectionOptions) {
    this.connectionOptions = connectionOptions;
  }

  async isSetUp() {
    return await connect(this.connectionOptions, queries.isSetUp);
  }

  async setUp() {
    return await connect(this.connectionOptions, queries.setUp);
  }

  async completedTimestamps() {
    return await connect(this.connectionOptions, queries.completedTimestamps);
  }

  async migrateUp(migration) {
    return await connect(this.connectionOptions, _.partialRight(queries.migrateUp, migration));
  }

  async migrateDown(migration) {
    return await connect(this.connectionOptions, _.partialRight(queries.migrateDown, migration));
  }
}
