// Simplify error handling in asynchronous route handlers and middleware.
// It takes an async function (fn) as input and returns a new function with the same signature (req, res, next).
// If the async function (fn) throws an error or rejects a Promise, the error is automatically caught
// and passed to Express's error-handling middleware using the `next` function.
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);

module.exports = catchAsync;
