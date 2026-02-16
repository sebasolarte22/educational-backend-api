const logger = require("../utils/logger");

module.exports = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  logger.error({
    event: "GLOBAL_ERROR_HANDLER",
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl
  });

  res.status(statusCode).json({
    status: err.status || "error",
    message
  });
};
