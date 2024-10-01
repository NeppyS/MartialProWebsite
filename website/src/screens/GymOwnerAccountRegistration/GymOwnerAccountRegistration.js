import React, { useState, useEffect } from "react";
import axios from "axios";

function GymOwnerAccountRegistration() {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(300); // 5 minutes countdown

  // Handle input change for the registration form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle sending OTP to the user's email
  const handleSendOtp = async () => {
    setError("");
    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        email: formValues.email,
      });

      if (response.data.success) {
        setIsOtpSent(true);
        setTimer(300); // Reset timer to 5 minutes (300 seconds)
      } else {
        setError("Failed to send OTP.");
      }
    } catch (err) {
      setError("Error occurred while sending OTP.");
    }
  };

  // Handle OTP countdown timer
  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setError("OTP expired. Please request a new OTP.");
      setIsOtpSent(false);
      setOtp("");
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  // Handle verifying the OTP entered by the user
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email: formValues.email,
        otp: otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setError("");

        // Optionally save the OTP if needed
        await axios.post("http://localhost:5000/api/save-otp", {
          email: formValues.email,
          otp: otp,
        });
      } else {
        setError("Invalid or expired OTP.");
      }
    } catch (err) {
      setError("Error occurred while verifying OTP.");
    }
  };

  // Handle final registration after OTP verification
  const handleFinalRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/register", formValues);

      if (response.data.success) {
        setSuccessMessage("Registration successful!");
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Error occurred while registering.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Gym Owner Registration</h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          {/* First Name */}
          <div className="flex flex-col">
            <label className="font-medium">First Name</label>
            <input
              type="text"
              name="fname"
              value={formValues.fname}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="font-medium">Last Name</label>
            <input
              type="text"
              name="lname"
              value={formValues.lname}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* OTP Sending and Verification */}
          {!isOtpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-blue-500 text-white p-3 rounded-md mt-4 w-full hover:bg-blue-600 transition duration-200"
            >
              Send OTP
            </button>
          ) : !otpVerified ? (
            <div className="flex flex-col mt-4">
              <label className="font-medium">OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button" // Ensure this is set to "button" to avoid form submission
                onClick={handleVerifyOtp}
                className="bg-green-500 text-white p-3 rounded-md mt-4 w-full hover:bg-green-600 transition duration-200"
              >
                Verify OTP
              </button>
              <p className="text-sm text-gray-600 mt-2">
                OTP expires in: {Math.floor(timer / 60)}:{timer % 60 < 10 ? `0${timer % 60}` : timer % 60} minutes
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <p className="text-green-500 text-center">OTP Verified. You can now complete your registration.</p>
              <button
                type="button"
                onClick={handleFinalRegistration}
                className="bg-purple-500 text-white p-3 rounded-md mt-4 w-full hover:bg-purple-600 transition duration-200"
              >
                Register Now
              </button>
            </div>
          )}
        </form>

        {/* Error and Success Messages */}
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        {successMessage && <p className="text-green-500 mt-4 text-center">{successMessage}</p>}
      </div>
    </div>
  );
}

export default GymOwnerAccountRegistration;
