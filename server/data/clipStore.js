const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "clips.json");

function readClips() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }

  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function writeClips(clips) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(clips, null, 2));
}

module.exports = {
  readClips,
  writeClips
};