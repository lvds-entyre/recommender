const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Database
const dbPath = path.resolve(__dirname, '../db/database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  }
});

// Helper function to safely parse JSON fields
const parseJSONField = (field) => {
  try {
    return JSON.parse(field);
  } catch (e) {
    console.error("Error parsing JSON field:", e);
    return null; // or an empty object/array based on the field
  }
};

// GET /api/programs - Retrieve all programs
router.get('/', (req, res) => {
  db.all('SELECT * FROM Programs', [], (err, rows) => {
    if (err) {
      console.error("Error fetching programs:", err.message);
      return res.status(500).json({ error: "Failed to fetch programs" });
    }

    // Parse JSON fields before sending
    const programs = rows.map(row => ({
      ...row,
      coverage: parseJSONField(row.coverage) || {},
      requiredDocuments: parseJSONField(row.requiredDocuments) || [],
      usefulLinks: parseJSONField(row.usefulLinks) || [],
      eligibility: parseJSONField(row.eligibility) || "",
      applicationProcess: parseJSONField(row.applicationProcess) || ""
      // Add more fields as necessary
    }));

    res.json(programs);
  });
});

module.exports = router;
