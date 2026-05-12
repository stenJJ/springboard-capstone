const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readUsers, writeUsers } = require("../data/userStore");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-later";

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email
  };
}

async function register(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const users = readUsers();

  const usernameExists = users.find(
    (user) => user.username.toLowerCase() === username.toLowerCase()
  );

  if (usernameExists) {
    return res.status(409).json({ error: "Username already exists" });
  }

  const emailExists = users.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (emailExists) {
    return res.status(409).json({ error: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeUsers(users);

  const token = createToken(newUser);

  res.status(201).json({
    token,
    user: sanitizeUser(newUser)
  });
}

async function login(req, res) {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res.status(400).json({ error: "Username/email and password are required" });
  }

  const users = readUsers();

  const user = users.find((currentUser) => {
    return (
      currentUser.username.toLowerCase() === usernameOrEmail.toLowerCase() ||
      currentUser.email.toLowerCase() === usernameOrEmail.toLowerCase()
    );
  });

  if (!user) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const passwordIsValid = await bcrypt.compare(password, user.passwordHash);

  if (!passwordIsValid) {
    return res.status(401).json({ error: "Invalid login credentials" });
  }

  const token = createToken(user);

  res.json({
    token,
    user: sanitizeUser(user)
  });
}

function getCurrentUser(req, res) {
  res.json({
    user: sanitizeUser(req.user)
  });
}

module.exports = {
  register,
  login,
  getCurrentUser
};