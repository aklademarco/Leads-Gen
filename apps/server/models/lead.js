const { pool } = require("../db");

const STATUSES = ["new", "contacted", "interested", "closed"];
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Map snake_case columns to the camelCase shape the API returned with Mongoose.
// `_id` is kept alongside `id` so existing clients keep working.
const COLUMNS = `
  id AS "_id",
  id,
  name,
  address,
  place_id AS "placeId",
  rating,
  phone,
  photo,
  review_count AS "reviewCount",
  open_now AS "openNow",
  website,
  status,
  notes,
  created_at AS "createdAt"
`;

const isValidId = (id) => UUID_RE.test(id);

const insertMany = async (leads) => {
  if (!leads.length) return [];

  const values = [];
  const rows = leads.map((lead, i) => {
    const base = i * 9;
    values.push(
      lead.name,
      lead.address ?? null,
      lead.placeId ?? null,
      lead.rating ?? null,
      lead.phone ?? null,
      lead.photo ?? null,
      lead.reviewCount ?? null,
      lead.openNow ?? null,
      lead.website ?? null,
    );
    return `(${Array.from({ length: 9 }, (_, j) => `$${base + j + 1}`).join(", ")})`;
  });

  const { rows: saved } = await pool.query(
    `INSERT INTO leads
       (name, address, place_id, rating, phone, photo, review_count, open_now, website)
     VALUES ${rows.join(", ")}
     RETURNING ${COLUMNS}`,
    values,
  );
  return saved;
};

const findAll = async () => {
  const { rows } = await pool.query(
    `SELECT ${COLUMNS} FROM leads ORDER BY created_at DESC`,
  );
  return rows;
};

// Only updates fields that were provided (like Mongoose ignoring undefined).
const updateById = async (id, { status, notes }) => {
  if (!isValidId(id)) return null;
  const { rows } = await pool.query(
    `UPDATE leads
        SET status = COALESCE($2, status),
            notes  = COALESCE($3, notes)
      WHERE id = $1
      RETURNING ${COLUMNS}`,
    [id, status ?? null, notes ?? null],
  );
  return rows[0] || null;
};

const deleteById = async (id) => {
  if (!isValidId(id)) return null;
  const { rows } = await pool.query(
    `DELETE FROM leads WHERE id = $1 RETURNING ${COLUMNS}`,
    [id],
  );
  return rows[0] || null;
};

module.exports = { STATUSES, insertMany, findAll, updateById, deleteById };
