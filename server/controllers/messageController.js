const db = require('../models/gymModel');

exports.getMessage = (req, res) => {
  db.query('SELECT message FROM messages LIMIT 1', (err, results) => {
    if (err) {
      console.error('Error fetching data from the database:', err);
      res.status(500).send('Server Error');
      return;
    }
    if (results.length > 0) {
      res.json({ message: results[0].message });
    } else {
      res.json({ message: 'No messages found' });
    }
  });
};
