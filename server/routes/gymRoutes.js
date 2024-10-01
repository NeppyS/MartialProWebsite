const express = require('express');
const router = express.Router();
const multer = require('multer');
const gymController = require('../controllers/gymController');
const mysql = require('mysql');
const nodemailer = require('nodemailer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbmartialpro',
});


db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to the database');
});


router.post('/submit', upload.fields([
  { name: 'gymPics', maxCount: 5 },
  { name: 'businessPermit', maxCount: 1 },
]), gymController.submitGymRegistration);


router.get('/registrations', (req, res) => {
  const query = 'SELECT * FROM gym_registration';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching registrations:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json(results);
  });
});


router.get('/registrations/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM gym_registration WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching registration:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.status(200).json(results[0]);
  });
});


router.get('/UsersPage', (req, res) => {
  const { role, orderBy } = req.query;
  let query = 'SELECT * FROM tbl_gymusers';
  const queryParams = [];

  
  if (role) {
    query += ' WHERE role = ?';
    queryParams.push(role);
  }

  
  if (orderBy) {
    query += ` ORDER BY ${mysql.escapeId(orderBy)}`;
  }

  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json(results);
  });
});


router.put('/registrations/:id/status_reg', (req, res) => {
  const id = req.params.id;
  const { status } = req.body; 

  const query = 'UPDATE gym_registration SET status_reg = ? WHERE id = ?';
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error('Error updating status:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    res.status(200).json({ message: 'Status updated successfully' });
  });
});


router.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com', 
      pass: 'your-email-password', 
    },
  });

  const mailOptions = {
    from: 'your-email@gmail.com', 
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully', info });
  });
});


router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); 

  
  const query = 'INSERT INTO tbl_otp (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?';
  db.query(query, [email, otp, expiresAt, otp, expiresAt], (err) => {
    if (err) {
      console.error('Error saving OTP:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
  });

  
  const mailOptions = {
    from: 'chiyokogaming02@gmail.com',
    to: email,
    subject: 'Your OTP Code',
    html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  };

  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chiyokogaming02@gmail.com',
        pass: 'lzyptlunqcpjkxla',
      },
    });

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully', success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ error: 'Failed to send OTP', success: false });
  }
});


router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  const query = 'SELECT * FROM tbl_otp WHERE email = ? AND otp = ?';
  db.query(query, [email, otp], (err, results) => {
    if (err) {
      console.error('Error verifying OTP:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }

    if (results.length === 0 || new Date() > results[0].expires_at) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    
    const deleteQuery = 'DELETE FROM tbl_otp WHERE email = ?';
    db.query(deleteQuery, [email], (err) => {
      if (err) {
        console.error('Error deleting OTP:', err.message);
      }
    });

    return res.status(200).json({ message: 'OTP verified successfully' });
  });
});


router.post('/register', (req, res) => {
  const { fname, lname, email, password, role = 'user' } = req.body; 

  
  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  
  const query = 'INSERT INTO tbl_gymusers (fname, lname, email, password, role) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [fname, lname, email, password, role], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ message: 'Database error', error: err.message });
    }
    res.status(200).json({ message: 'User registered successfully' });
  });
});

module.exports = router;
