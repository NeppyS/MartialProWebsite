const express = require('express');
const multer = require('multer');
const path = require('path');
const db = require('../db'); 
const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });


router.post('/upload-video', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No video file uploaded.' });
  }

  const videoPath = `/uploads/${req.file.filename}`;

  
  const query = 'INSERT INTO tbl_video (video_path) VALUES (?)';
  db.query(query, [videoPath], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error saving video to database.' });
    }
    res.status(200).json({ message: 'Video uploaded successfully!', videoPath });
  });
});


router.get('/video/:id', (req, res) => {
  const videoId = req.params.id;
  const query = 'SELECT video_path FROM tbl_video WHERE id = ?';

  db.query(query, [videoId], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching video.' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Video not found.' });
    }
    res.status(200).json(results[0]);
  });
});


router.get('/videos', (req, res) => {
  const query = 'SELECT id, video_path FROM tbl_video';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Error fetching videos.' });
    }
    res.status(200).json(results);
  });
});

module.exports = router;
