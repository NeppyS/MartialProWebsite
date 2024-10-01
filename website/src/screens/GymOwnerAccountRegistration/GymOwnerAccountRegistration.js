import React, { useState, useEffect } from "react";
import axios from "axios";

function GymOwnerAccountRegistration() {
  const [formValues, setFormValues] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
    role: "", 
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [timer, setTimer] = useState(100);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/send-otp", {
        email: formValues.email,
      });

      if (response.data.success) {
        setIsOtpSent(true);
        setTimer(100);
        alert("OTP sent successfully!");
      } else {
        setError("Failed to send OTP.");
        alert("Failed to send OTP.");
      }
    } catch (err) {
      setError("Error occurred while sending OTP.");
      alert("Error occurred while sending OTP.");
    }
    setLoading(false);
  };

  useEffect(() => {
    let interval;
    if (isOtpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    if (timer === 0) {
      setError("OTP expired. Please request a new OTP.");
      alert("OTP expired. Please request a new OTP.");
      setIsOtpSent(false);
      setOtp("");
    }
    return () => clearInterval(interval);
  }, [isOtpSent, timer]);

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/verify-otp", {
        email: formValues.email,
        otp: otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        setError("");
        alert("OTP verified successfully!");
      } else {
        setError("Invalid or expired OTP.");
        alert("Invalid or expired OTP.");
      }
    } catch (err) {
      setError("Error occurred while verifying OTP.");
      alert("Error occurred while verifying OTP.");
    }
    setLoading(false);
  };

  const handleFinalRegistration = async () => {
    if (!otpVerified) {
      setError("Please verify your OTP before registering.");
      alert("Please verify your OTP before registering.");
      return;
    }

    setLoading(true);
    try {
      
      console.log("Form Values Before Sending: ", formValues);

      const response = await fetch('http://localhost:5000/api/gymusers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: formValues.fname,
          lname: formValues.lname,
          email: formValues.email,
          password: formValues.password,
          otp: otp,
          role: formValues.role, 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Network response was not ok');
      }

      const data = await response.json();
      if (data.success) {
        setSuccessMessage("Registration successful!");
        setError("");
        alert("Registration successful!");
      } else {
        setError(data.message || "Registration failed.");
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error('Error occurred while registering:', error);
      setError(`Error occurred while registering: ${error.message}`);
      alert(`Error occurred while registering: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Gym Owner Registration</h1>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
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

          <div className="flex flex-col">
            <label className="font-medium">Role</label>
            <select
              name="role"
              value={formValues.role}
              onChange={handleInputChange}
              className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Role</option>
              <option value="Member">Member</option>
              <option value="Owner">Owner</option>
              <option value="Coach">Coach</option>
            </select>
          </div>

          {!isOtpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className={`${
                loading ? "bg-blue-300" : "bg-blue-500"
              } text-white p-3 rounded-md mt-4 w-full hover:bg-blue-600 transition duration-200`}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
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
                type="button" 
                onClick={handleVerifyOtp}
                className={`${
                  loading ? "bg-green-300" : "bg-green-500"
                } text-white p-3 rounded-md mt-4 w-full hover:bg-green-600 transition duration-200`}
                disabled={loading} 
              >
                {loading ? "Verifying OTP..." : "Verify OTP"}
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
                className={`${
                  loading ? "bg-blue-300" : "bg-blue-500"
                } text-white p-3 rounded-md mt-4 w-full hover:bg-blue-600 transition duration-200`}
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Now"}
              </button>
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-center mt-4">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default GymOwnerAccountRegistration;
