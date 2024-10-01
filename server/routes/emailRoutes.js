const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailcontroller");

// Route to send an email
router.post("/send-email", emailController.sendEmail);

// Route to send OTP
router.post("/send-otp", emailController.sendOtp);

// Route to verify OTP (add this if you haven’t already)
router.post("/verify-otp", emailController.verifyOtp);

module.exports = router;
