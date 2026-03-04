const { exec } = require("child_process");

const connection = process.env.DATABASE_URL;

if (!connection) {
  console.error("DATABASE_URL not defined");
  process.exit(1);
}

const command = `psql ${connection} < docker/postgres/init.sql`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error("Error running init.sql:", error);
    return;
  }

  console.log("Database initialized successfully");
  console.log(stdout);
});