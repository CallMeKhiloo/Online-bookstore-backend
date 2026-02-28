const customError = require('../helpers/customError');

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: 'unsuccessful',
    message: err.message,
  });
}

module.exports = globalErrorHandler;