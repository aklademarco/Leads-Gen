const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { ensureDB } = require("./db");
const leadsRoute = require("./routes/leads");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true, service: "leadfind-api" });
});

// Make sure the database is reachable and the schema is set up before any
// leads route runs. Unreachable DB → a clear 503 instead of a blank 500.
app.use("/api/v1/leads", async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (error) {
    res.status(503).json({
      error: "Database unavailable. Please try again in a moment.",
      message: error.message || error.code || "",
    });
  }
});
app.use("/api/v1/leads", leadsRoute);

// Locally (`node index.js` / nodemon) start a server. On Vercel the exported
// app is wrapped in a serverless function instead.
if (require.main === module) {
  ensureDB().catch(() => {
    console.error("Will retry the database on the next request.");
  });
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
}

module.exports = app;
