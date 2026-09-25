const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL pool error:", err);
});

async function connectDB() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing in .env");
  }

  const client = await pool.connect();
  try {
    await client.query("SELECT current_database(), current_user");
    console.log("PostgreSQL connected successfully");
  } finally {
    client.release();
  }
}

module.exports = { pool, connectDB };
