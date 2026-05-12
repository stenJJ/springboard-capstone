const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "users.json");

function readUsers() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }

  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

module.exports = {
  readUsers,
  writeUsers
};