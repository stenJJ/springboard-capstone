const jwt = require("jsonwebtoken");
const { readUsers } = require("../data/userStore");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-later";

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const users = readUsers();
    const user = users.find((currentUser) => currentUser.id === payload.id);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

module.exports = requireAuth;