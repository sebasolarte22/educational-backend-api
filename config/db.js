const { Pool } = require("pg");

const isTest = process.env.NODE_ENV === "test";

const connectionString = isTest
  ? process.env.DATABASE_URL_TEST
  : process.env.DATABASE_URL;

const pool = new Pool({
  connectionString,
  idleTimeoutMillis: isTest ? 1 : 10000
});

module.exports = pool;
