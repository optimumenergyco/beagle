// The instructions for subclassing Error were taken from:
// https://medium.com/@xjamundx/custom-javascript-errors-in-es6-aa891b173f87
export default class ValidationError extends Error {

  constructor(...args) {
    super(...args);
    Error.captureStackTrace(this, ValidationError);
  }
}
