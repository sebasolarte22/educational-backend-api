const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async () => {
  const connectionString = process.env.DATABASE_URL_TEST;

  if (!connectionString) {
    throw new Error("DATABASE_URL_TEST is not defined. Please add it to your .env file.");
  }

  const pool = new Pool({ connectionString });

  try {
    const sqlPath = path.join(__dirname, "..", "docker", "postgres", "init.sql");
    const sql = fs
      .readFileSync(sqlPath, "utf8")
      .replace(/CREATE TABLE\s+/g, "CREATE TABLE IF NOT EXISTS ")
      .replace(/CREATE INDEX\s+/g, "CREATE INDEX IF NOT EXISTS ");

    await pool.query(sql);
  } finally {
    await pool.end();
  }
};
