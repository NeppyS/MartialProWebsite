const nodemailer = require('nodemailer');

// Object to store OTPs (In-memory storage for simplicity)
const otps = {};

// Function to send email
exports.sendEmail = async (req, res) => {
  const { to, subject, html } = req.body;

  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chiyokogaming02@gmail.com", // Email address
      pass: "lzyptlunqcpjkxla", // App password
    },
  });

  // Set up email data
  const mailOptions = {
    from: "chiyokogaming02@gmail.com", // Sender's email
    to,
    subject,
    html,
  };

  try {
    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
};

// Function to send OTP
exports.sendOtp = async (req, res) => {
  const { email } = req.body;

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Store OTP in-memory (expires after 5 minutes)
  otps[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

  // Create email content
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
};

// Function to verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  console.log("Received email:", email); // Log the received email
  console.log("Received OTP:", otp); // Log the received OTP
  console.log("Current Time:", Date.now(), "OTP Expiry Time:", otps[email].expiresAt);

  if (otps[email] && otps[email].otp == otp && Date.now() < otps[email].expiresAt) {
    delete otps[email]; // Remove OTP after verification
    return res.status(200).json({ message: "OTP verified successfully", success: true });
} else {
    return res.status(400).json({ message: "Invalid or expired OTP", success: false });
}
};
