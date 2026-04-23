function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: {
      message: err.message || "Internal server error",
      statusCode,
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
