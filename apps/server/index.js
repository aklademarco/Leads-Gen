const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { connectDB } = require("./db");
const leadsRoute = require("./routes/leads");
const app = express();
const PORT = process.env.PORT;

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/v1/leads", leadsRoute);

app.listen(PORT, () => {
  console.log(`....Server is ruuning on port:  ${PORT}`);
});
