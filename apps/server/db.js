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

    // One Google place = one lead. Older versions saved a fresh copy on every
    // search, so collapse existing duplicates before enforcing uniqueness.
    // Keep the copy that has been worked on (status moved on, or has notes),
    // otherwise the oldest one.
    const { rowCount: removed } = await pool.query(`
      DELETE FROM leads
       WHERE id IN (
         SELECT id FROM (
           SELECT id,
                  ROW_NUMBER() OVER (
                    PARTITION BY place_id
                    ORDER BY (status <> 'new') DESC,
                             (notes <> '') DESC,
                             created_at ASC
                  ) AS rn
             FROM leads
            WHERE place_id IS NOT NULL
         ) ranked
         WHERE rn > 1
       );
    `);
    if (removed) console.log(`Removed ${removed} duplicate lead(s)`);
    await pool.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS leads_place_id_key ON leads (place_id);`,
    );
    console.log("PostgreSQL (Neon) connected");
  } catch (error) {
    console.error("PostgreSQL connection failed", error.message || error.code);
    throw error;
  }
};

// Runs the schema setup once per process (or per serverless instance) and
// lets requests wait for it. A failed attempt is retried on the next request
// instead of killing the process, which matters on Vercel.
let ready = null;
const ensureDB = () => {
  if (!ready) {
    ready = connectDB().catch((error) => {
      ready = null;
      throw error;
    });
  }
  return ready;
};

module.exports = { pool, connectDB, ensureDB };
