const { Prisma } = require('@prisma/client');
const ApiError = require('../utils/ApiError');
const { nodeEnv } = require('../config/env');

const notFound = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = err.meta?.target;
      error = ApiError.conflict(`Duplicate value for ${[].concat(fields || 'field').join(', ')}`);
    } else if (err.code === 'P2025') {
      error = ApiError.notFound();
    } else if (err.code === 'P2003') {
      error = ApiError.badRequest('Related record does not exist');
    }
  } else if (err.type === 'entity.parse.failed') {
    error = ApiError.badRequest('Malformed JSON body');
  }

  const statusCode = error.statusCode || 500;
  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && nodeEnv === 'production' ? 'Internal server error' : error.message,
    ...(error.details && { details: error.details }),
    ...(nodeEnv === 'development' && statusCode >= 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
