// historyService.js
const fs = require("fs");
const path = require("path");

// Folder where history files will be stored
const HISTORY_FOLDER = path.join(__dirname, "history");

// Ensure folder exists
if (!fs.existsSync(HISTORY_FOLDER)) {
  fs.mkdirSync(HISTORY_FOLDER);
}

// Create full path for a given id
function getFilePath(id) {
  return path.join(HISTORY_FOLDER, `${id}.json`);
}


// Read request history for a user
function getRequestData(id) {
  const filePath = getFilePath(id);

  if (!fs.existsSync(filePath)) {
    return []; // No history yet
  }

  const content = fs.readFileSync(filePath, "utf-8");
  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("JSON read error:", err);
    return [];
  }
}

// Add new request data to history
function addRequestData(id, newData) {
  const filePath = getFilePath(id);

  let history = [];

  // If file exists, load existing
  if (fs.existsSync(filePath)) {
    try {
      history = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error("JSON parse error:", err);
      history = [];
    }
  }

  // Push new entry
  history.push({
    ...newData,
    storedAt: new Date().toISOString()
  });

  // Save back to file
  fs.writeFileSync(filePath, JSON.stringify(history, null, 2));

  return true;
}

module.exports = {
  addRequestData,
  getRequestData
};