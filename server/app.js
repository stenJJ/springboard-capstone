const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const clipRoutes = require("./routes/clipRoutes");
const requireAuth = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ message: "ClipVault API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/clips", requireAuth, clipRoutes);

module.exports = app;