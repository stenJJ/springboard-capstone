const express = require("express");
const cors = require("cors");
const clipRoutes = require("./routes/clipRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "ClipVault API is running" });
});

app.use("/api/clips", clipRoutes);

module.exports = app;