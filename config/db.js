const { Pool } = require("pg");

const pool = new Pool({
  host: "localhost",
  user: "sebastianolarte",
  database: "postgres",
  port: 5432,

  // 🔑 IMPORTANTE para Jest
  idleTimeoutMillis: 1,
  connectionTimeoutMillis: 0
});

module.exports = pool;
