const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbmartialpro'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to the database');
});

exports.submitGymRegistration = (req, res) => {
  const {
    fname,
    mname,
    lname,
    email,
    dob,
    gymname,
    complete_address,
    dateEstablished,
    location,
  } = req.body;

  const gymPics = req.files['gymPics'] ? req.files['gymPics'].map(file => file.path) : [];
  const businessPermit = req.files['businessPermit'] ? req.files['businessPermit'][0].path : '';

  const socialMediaLinks = req.body.socialMediaLinks || [];

  console.log("Received data:", {
    fname,
    mname,
    lname,
    email,
    dob,
    gymname,
    complete_address,
    dateEstablished,
    location,
    gymPics,
    businessPermit,
    socialMediaLinks,
  });

  if (!fname || !email || !complete_address) {
    return res.status(400).json({ message: 'Missing required fields: fname, email, or complete_address.' });
  }

  const socialMediaLinksJson = JSON.stringify(socialMediaLinks);
  const submissionTime = new Date(); 

  const query = `
    INSERT INTO gym_registration 
    (fname, mname, lname, email, dob, gymname, complete_address, dateEstablished, location, businessPermit, gymPics, socialMediaLinks, submission_time)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      fname,
      mname,
      lname,
      email,
      dob,
      gymname,
      complete_address,
      dateEstablished,
      location,
      businessPermit,
      JSON.stringify(gymPics),
      socialMediaLinksJson,
      submissionTime,
    ],
    (err, results) => {
      if (err) {
        console.error("Error inserting gym registration:", err.message);
        return res
          .status(500)
          .json({ message: "Database Error", error: err.message });
      }

      res
        .status(200)
        .json({ message: "Gym registration submitted successfully!" });
    }
  );
};

// fetch tbl_gymusers
exports.getUsers = (req, res) => {
  const { role, orderBy } = req.query;
  let query = "SELECT id, name, role, email FROM tbl_gymusers";

  // Add role filtering if specified
  if (role) {
    query += ` WHERE role = '${role}'`;
  }

  //sorting code
  const sortField = orderBy || 'id'; 
  query += ` ORDER BY ${sortField}`;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.message);
      return res.status(500).json({ message: 'Database Error', error: err.message });
    }
    res.status(200).json(results);
  });
};
