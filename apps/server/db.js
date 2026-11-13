const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DB_URI,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

pool.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error.message);
});

const connectDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name          TEXT NOT NULL,
        address       TEXT,
        place_id      TEXT,
        rating        DOUBLE PRECISION,
        phone         TEXT,
        photo         TEXT,
        review_count  INTEGER,
        open_now      BOOLEAN,
        website       TEXT,
        status        TEXT NOT NULL DEFAULT 'new'
                      CHECK (status IN ('new', 'contacted', 'interested', 'closed')),
        notes         TEXT NOT NULL DEFAULT '',
        created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
    `);
    console.log("PostgreSQL (Neon) connected");
  } catch (error) {
    console.error("PostgreSQL connection failed", error.message);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };
