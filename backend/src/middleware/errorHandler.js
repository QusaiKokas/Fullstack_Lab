function notFoundHandler(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((errorItem) => errorItem.message)
      .join(", ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid id format.";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "A record with the same unique value already exists.";
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
