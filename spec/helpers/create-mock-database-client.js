import sinon from 'sinon';

export default function createMockDatabaseClient() {

  let mockDatabaseClient = {
    isSetUp: sinon.stub().resolves(true),
    setUp: sinon.stub().resolves(),
    completedTimestamps: sinon.stub().resolves([]),
    migrateUp: sinon.stub().resolves(),
    migrateDown: sinon.stub().resolves()
  };

  let MockDatabaseClient = sinon.stub().returns(mockDatabaseClient);
  MockDatabaseClient.mockDatabaseClient = mockDatabaseClient;

  return MockDatabaseClient;
}
