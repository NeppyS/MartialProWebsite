const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const gymRoutes = require('./routes/gymRoutes'); 
const emailRoutes = require('./routes/emailRoutes');
const videoRoutes = require('./routes/videoRoutes'); 

const app = express();
const port = 5000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static('uploads'));

app.use('/api/gymregistration', gymRoutes); 
app.use('/api', emailRoutes);
app.use('/api', videoRoutes);

app.get('/api/gymregistration/registrations', (req, res) => {
  const query = 'SELECT * FROM gym_registration'; 
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching registrations:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json(results);
  });
});

// Health check route for troubleshooting
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'API is running smoothly' });
});

// Middleware for logging requests (optional, for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
