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
    cb(null, Date.now() + '-' + file.originalname);
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

// Submit gym registration
router.post('/submit', upload.fields([
  { name: 'gymPics', maxCount: 5 },
  { name: 'businessPermit', maxCount: 1 },
]), gymController.submitGymRegistration);

// Get all registrations
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

// Get a single registration by ID
router.get("/registrations/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM gym_registration WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error fetching registration:", err.message);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }
    res.status(200).json(results[0]);
  });
});

// Fetch tbl_gymusers
router.get('/UsersPage', (req, res) => { 
  const { role, orderBy } = req.query;
  let query = 'SELECT * FROM tbl_gymusers';
  
  // Role
  if (role) {
    query += ' WHERE role = ?';
  }

  // Sorting
  if (orderBy) {
    query += ` ORDER BY ${mysql.escapeId(orderBy)}`;
  }

  db.query(query, role ? [role] : [], (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json(results);
  });
});

// Update registration status
router.put("/registrations/:id/status_reg", (req, res) => {
  const id = req.params.id;
  const { status } = req.body; // Status should be 1 for ACCEPT and 0 for REJECT

  const query = "UPDATE gym_registration SET status_reg = ? WHERE id = ?";
  db.query(query, [status, id], (err, results) => {
    if (err) {
      console.error("Error updating status:", err.message);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.status(200).json({ message: "Status updated successfully" });
  });
});

// Email Sending Functionality
router.post('/send-email', (req, res) => {
  const { to, subject, html } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com', // Your email
      pass: 'your-email-password' // Your email password or app password
    }
  });

  const mailOptions = {
    from: 'your-email@gmail.com', // Sender's email
    to,
    subject,
    html
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error.message);
      return res.status(500).json({ message: 'Error sending email', error: error.message });
    }
    res.status(200).json({ message: 'Email sent successfully', info });
  });
});

// New Route for Sending OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

  // Store OTP in tbl_otp
  const query = 'INSERT INTO tbl_otp (email, otp, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp = ?, expires_at = ?';
  db.query(query, [email, otp, expiresAt, otp, expiresAt], (err) => {
    if (err) {
      console.error("Error saving OTP:", err.message);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }
  });

  // Create email content for OTP
  const mailOptions = {
    from: "chiyokogaming02@gmail.com",
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 5 minutes.</p>`,
  };

  try {
    // Send OTP email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "chiyokogaming02@gmail.com",
        pass: "lzyptlunqcpjkxla",
      },
    });

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully", success: true });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP", success: false });
  }
});

// New Route for Verifying OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  const query = 'SELECT * FROM tbl_otp WHERE email = ? AND otp = ?';
  db.query(query, [email, otp], (err, results) => {
    if (err) {
      console.error("Error verifying OTP:", err.message);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }
    
    if (results.length === 0 || new Date() > results[0].expires_at) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // OTP is valid, delete it from tbl_otp
    const deleteQuery = 'DELETE FROM tbl_otp WHERE email = ?';
    db.query(deleteQuery, [email], (err) => {
      if (err) {
        console.error("Error deleting OTP:", err.message);
      }
    });

    return res.status(200).json({ message: "OTP verified successfully" });
  });
});

// New Route for Final Registration
router.post('/register', (req, res) => {
  const { fname, lname, email, password } = req.body;

  // Insert new user into tbl_gymusers
  const query = 'INSERT INTO tbl_gymusers (fname, lname, email, password) VALUES (?, ?, ?, ?)';
  db.query(query, [fname, lname, email, password], (err) => {
    if (err) {
      console.error("Error saving gym user:", err.message);
      return res.status(500).json({ message: "Database Error", error: err.message });
    }
    res.status(201).json({ message: "Registration successful" });
  });
});

module.exports = router;
