import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import shield from "../../assets/On Screen Confirmation Form/mdi_security-lock-outline.svg";
import BackIcon from "../../assets/On Screen Confirmation Form/back.svg";

function GymRegistration() {
  const [formValues, setFormValues] = useState({
    fname: "",
    mname: "",
    lname: "",
    dob: "",
    email: "",
    complete_address: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleNext = async () => {
    // const emailData = {
    //   to: formValues.email, // Use the email from formValues
    //   subject: "Gym Registration Confirmation",
    //   text: `Dear ${formValues.fname},\n\nThank you for registering your gym. Your registration details are as follows:\n\nName: ${formValues.fname} ${formValues.mname} ${formValues.lname}\nDate of Birth: ${formValues.dob}\nAddress: ${formValues.complete_address}\n\nPlease confirm your registration by replying to this email.\n\nBest Regards,\nYour Gym Registration Team`,
    // };

    // try {
    //   // Send the email via your backend
    //   const response = await axios.post(
    //     "http://localhost:5000/api/send-email",
    //     emailData
    //   );
    //   console.log(response.data);

    //   // Navigate to the next page and pass formValues as props
    //   navigate("/TwoGymRegistration", { state: { formValues } });
    // } catch (error) {
      //   console.error("Error sending email:", error);
      // }
        navigate("/TwoGymRegistration", { state: { formValues } });
  };

  return (
    <div className="parent">
      <div className="backheader">
        <div className="backcontainer">
          <div className="backimage">
            <img src={BackIcon} alt="Back" />
          </div>
          <div className="backtext">
            <h1>Back</h1>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center">
        <div className="bg-tomato text-[35px] flex justify-center items-center w-full md:w-[40%] text-center font-medium">
          <img src={shield} alt="Shield" />
        </div>
        <div className="bg-tomato text-[30px] flex justify-center items-center w-full md:w-[50%] text-center font-medium mb-3">
          <h1>
            Secure Your Gym <br />
            with Verified Registration.
          </h1>
        </div>
        <div className="text-center text-[#6F6F6F] font-[20px]">
          <p>
            Protect Your Gym's Integrity with a Verified Registration Process
            You Can Trust.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center mt-5">
        <div className="text-left font-semibold m-10">
          <h1>GYM OWNER’S PERSONAL INFORMATION</h1>
        </div>

        <form
          className="flex flex-col space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-row flex-wrap">
            <div className="mr-5 flex-1">
              <label className="block text-sm font-medium text-[16px]">
                First Name
              </label>
              <input
                type="text"
                name="fname"
                value={formValues.fname}
                onChange={handleInputChange}
                placeholder="ex. John"
                className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div className="mr-5 flex-1">
              <label className="block text-sm font-medium text-[16px]">
                Middle Name
              </label>
              <input
                type="text"
                name="mname"
                value={formValues.mname}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[16px]">
                Surname
              </label>
              <input
                type="text"
                name="lname"
                value={formValues.lname}
                onChange={handleInputChange}
                placeholder="ex. Smith"
                className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-row flex-wrap">
            <div className="mr-5 flex-1">
              <label className="block text-sm font-medium text-[14px]">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formValues.dob}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full text-[16px] rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-[16px]">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-[16px]">
              Complete Address
            </label>
            <input
              type="text"
              name="complete_address"
              value={formValues.complete_address}
              onChange={handleInputChange}
              placeholder="Address"
              className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-gray-300 focus:border-gray-500 focus:ring-0"
            />
          </div>

          <div className="flex-1">
            <button
              type="button"
              onClick={handleNext}
              className="mt-6 w-full p-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GymRegistration;
