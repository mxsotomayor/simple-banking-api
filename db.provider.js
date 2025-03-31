const fs = require("fs");
const path = require("path");

function flushData() {
  const jsonData = JSON.stringify({ users }, null, 2); // Pretty-print with 2 spaces
  fs.writeFileSync(path.join(__dirname, "db.json"), jsonData, "utf8");
}

function pullData(key) {
  let rawData = fs.readFileSync(path.join(__dirname, "db.json"), "utf8");
  let data = JSON.parse(rawData);
  return data[key];
}

module.exports = { flushData, pullData };
