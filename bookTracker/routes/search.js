const express = require('express');
const router = express.Router();
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('search.db');

// Create table if not exists
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS searches (id INTEGER PRIMARY KEY AUTOINCREMENT, term TEXT)");
});

/* POST search */
router.post('/search', async function(req, res, next) {
  const searchTerm = req.body.q; // Get the search term from the request body

  try {
    // Insert search term into SQLite database
    db.run("INSERT INTO searches (term) VALUES (?)", [searchTerm], function(err) {
      if (err) {
        console.error('Error inserting search term into database:', err);
      } else {
        console.log(`Search term "${searchTerm}" inserted into database with ID ${this.lastID}`);
      }
    });

    // Make a GET request to the Open Library API
    const response = await axios.get('https://openlibrary.org/search.json', {
      params: {
        q: searchTerm // Pass the search term as a query parameter
      }
    });

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'An error occurred while fetching data.' });
  }
});

module.exports = router;
