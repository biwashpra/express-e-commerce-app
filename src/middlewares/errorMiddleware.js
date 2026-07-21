// Even if you never use next, Express requires all four parameters to recognize it as an error-handling middleware. This is a long-standing Express convention (and still applies in Express 5).
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error("error", err);

  let statusCode = err.statusCode || 500;
  let code = err.code || "INTERNAL_SERVER_ERROR";
  let message = err.message || "Internal Server Error";
  let details = err.details || null;

  // Invalid Mongo ObjectId
  if (err.name === "CastError") {
    statusCode = 404;
    code = "RESOURCE_NOT_FOUND";
    message = "Resource not found.";
  }

  // Duplicate Key
  if (err.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_RESOURCE";
    message = "Duplicate field value entered.";
  }

  // Validation Error
  if (err.name === "ValidationError") {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Validation failed.";

    details = Object.values(err.errors).map((error) => ({
      field: error.path,
      message: error.message,
    }));
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  });
};

export default errorMiddleware;
