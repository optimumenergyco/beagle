import sinon from 'sinon';

export default function createMockLogger() {
  return {
    info: sinon.stub(),
    notice: sinon.stub(),
    success: sinon.stub(),
    error: sinon.stub()
  };
}
