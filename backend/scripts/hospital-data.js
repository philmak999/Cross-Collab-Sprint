const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "..", ".env") });

const sqlFile =
  process.env.DB_SQL_FILE ||
  path.join(__dirname, "..", "data", "seed.mysql");

async function run() {
  if (!fs.existsSync(sqlFile)) {
    console.error(`SQL file not found: ${sqlFile}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(sqlFile, "utf8");
  if (!sql.trim()) {
    console.error("SQL file is empty.");
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || undefined,
    multipleStatements: true,
  });

  try {
    await connection.query(sql);
    console.log("Database import completed.");
  } finally {
    await connection.end();
  }
}

run().catch((error) => {
  console.error("Database import failed:");
  console.error(error);
  process.exit(1);
});
