const { createLogger, format, transports } = require("winston");

const isTest = process.env.NODE_ENV === "test";

const logger = createLogger({
  level: "http",
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({
      silent: isTest
    }),
    new transports.File({
      filename: "error.log",
      level: "error",
      silent: isTest
    }),
    new transports.File({
      filename: "combined.log",
      silent: isTest
    })
  ]
});

module.exports = logger;
