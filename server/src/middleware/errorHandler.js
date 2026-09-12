/**
 * 404 Not Found Middleware
 */
const notFound = (req, res, next) => {
  res.status(404).json({ error: `Not Found - ${req.originalUrl}` });
};

/**
 * Central Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Unhandled Error:', err.stack || err);

  const statusCode = err.status || err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: message
  });
};

module.exports = {
  notFound,
  errorHandler
};
