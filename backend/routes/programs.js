// backend/routes/programs.js

const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Initialize Database
const dbPath = path.resolve(__dirname, '..', 'db', 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// GET /api/programs - Fetch all programs with descriptions
router.get('/', (req, res) => {
  db.all("SELECT * FROM Programs", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

module.exports = router;
