import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom"; // Use useNavigate instead of useHistory
import shield from "../../assets/On Screen Confirmation Form/mdi_security-lock-outline.svg";
import BackIcon from "../../assets/On Screen Confirmation Form/back.svg";

function Twogymregistration() {
const location = useLocation();
const previousFormValues = location.state?.formValues || {}; // Retrieve the previous form values
const [formValues, setFormValues] = useState({
  gymname: "",
  dateEstablished: "",
  location: "",
  gymPics: [],
  businessPermit: [],
  socialMediaLinks: [
    { platformName: "", link: "" },
    { platformName: "", link: "" },
    { platformName: "", link: "" },
  ],
  ...previousFormValues, // Spread the previous form values here
});

const navigate = useNavigate();

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormValues({
    ...formValues,
    [name]: value,
  });
};

const handleSocialMediaChange = (index, e) => {
  const { name, value } = e.target;
  const updatedLinks = [...formValues.socialMediaLinks];
  updatedLinks[index][name] = value;
  setFormValues({ ...formValues, socialMediaLinks: updatedLinks });
};

const handleImageChange = (e) => {
  const { name, files } = e.target;
  if (files) {
    const imagesArray = Array.from(files);
    setFormValues({
      ...formValues,
      [name]: imagesArray,
    });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("gymname", formValues.gymname);
  formData.append("dateEstablished", formValues.dateEstablished);
  formData.append("location", formValues.location);

  // Append the previous form values
  for (const [key, value] of Object.entries(previousFormValues)) {
    formData.append(key, value);
  }

  if (formValues.gymPics) {
    formValues.gymPics.forEach((pic) => {
      formData.append("gymPics", pic);
    });
  }

  if (formValues.businessPermit) {
    formValues.businessPermit.forEach((permit) => {
      formData.append("businessPermit", permit);
    });
  }

  if (formValues.socialMediaLinks) {
    formValues.socialMediaLinks.forEach((link, index) => {
      formData.append(
        `socialMediaLinks[${index}][platformName]`,
        link.platformName
      );
      formData.append(`socialMediaLinks[${index}][link]`, link.link);
    });
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/api/gymregistration/submit",

      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

 
    console.log("gasulod na");
  } catch (error) {
    console.log(error);
  }

  const emailData = {
    to: formValues.email,
    subject: "Gym Registration Confirmation",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Gym Registration Confirmation</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7fafc;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333333;
        }
        .content {
          font-size: 16px;
          color: #555555;
          line-height: 1.6;
        }
        .content strong {
          color: #333333;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          text-align: center;
          color: #888888;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">Gym Registration Confirmation</div>
        <div class="content">
          <p>Dear ${formValues.fname},</p>
          <p>Thank you for submitting your application for gym registration with us at <strong>MartialPro</strong>. We wanted to inform you that your request is currently being processed.</p>
          <p>Please note that the review process may take between <strong>1 to 4 business days</strong> as our team at MartialPro carefully verifies all submitted information.</p>
          <p>Rest assured, we are committed to ensuring that all applications are thoroughly reviewed to maintain the highest standards of security and legitimacy.</p>
          <p>You will receive a follow-up email once the review is complete. If you have any questions in the meantime, please don't hesitate to reach out to us.</p>
          <p>Thank you for your patience and understanding.</p>
        </div>
        <div class="footer">
          © 2024 MartialPro. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `,
  };


  try {
    
    const response = await axios.post(
      "http://localhost:5000/api/send-email",
      emailData
    );
   
    console.log(response.data);

    // Navigate to the next page and pass formValues as props
    navigate("/OSR");
  } catch (error) {
    console.error("Error sending email:", error);
  }


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

      <div className="items-center flex flex-col">
        <div className="flex flex-col w-full md:w-1/2 mt-5">
          <div className="text-left m-10">
            <h1 className="font-semibold">GYM INFORMATION</h1>
            <p className="text-[#6F6F6F]">
              You have to comply and fill up this information for legit
              verification if the gym actually exists.
            </p>
          </div>

          <form className="m-10" onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 mr-5">
                <label className="block text-sm font-medium text-[16px]">
                  Gym Name
                </label>
                <input
                  type="text"
                  name="gymname"
                  value={formValues.gymname}
                  onChange={handleInputChange}
                  placeholder="MartialPro Fitness"
                  className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-color: rgb(0 0 0); focus:border-gray-500 focus:ring-0"
                />
              </div>

              <div className="w-full md:w-1/2">
                <label className="block text-sm font-medium text-[16px]">
                  Date Established
                </label>
                <input
                  type="date"
                  name="dateEstablished"
                  value={formValues.dateEstablished}
                  onChange={handleInputChange}
                  className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-color: rgb(0 0 0); focus:border-gray-500 focus:ring-0"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-[16px]">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formValues.location}
                onChange={handleInputChange}
                className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-color: rgb(0 0 0); focus:border-gray-500 focus:ring-0"
              />
            </div>

            <div className="w-full mt-5">
              <label className="block text-sm font-medium text-[16px]">
                Gym Pics
              </label>
              <input
                type="file"
                name="gymPics"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <div className="image-preview-container mt-3 flex flex-wrap">
                {formValues.gymPics.map((image, index) => (
                  <div key={index} className="mr-2 mb-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Gym Pic ${index}`}
                      style={{ width: "200px" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full mt-5">
              <label className="block text-sm font-medium text-[16px]">
                Business Permit
              </label>
              <input
                type="file"
                name="businessPermit"
                accept="image/*"
                onChange={handleImageChange}
                multiple
              />
              <div className="image-preview-container mt-3 flex flex-wrap">
                {formValues.businessPermit.map((image, index) => (
                  <div key={index} className="mr-2 mb-2">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Business Permit ${index}`}
                      style={{ width: "200px" }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <h1 className="mt-10 mb-5">SOCIAL MEDIA LINKS</h1>

            {formValues.socialMediaLinks.map((link, index) => (
              <div key={index} className="flex flex-col md:flex-row mt-5">
                <div className="w-full md:w-1/2 mr-5">
                  <label className="block text-sm font-medium">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    name="platformName"
                    value={link.platformName}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                    className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-color: rgb(0 0 0); focus:border-gray-500 focus:ring-0"
                  />
                </div>

                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium">Link</label>
                  <input
                    type="url"
                    name="link"
                    value={link.link}
                    onChange={(e) => handleSocialMediaChange(index, e)}
                    className="mt-1 p-2 block w-full rounded-sm bg-white border-2 border-color: rgb(0 0 0); focus:border-gray-500 focus:ring-0"
                  />
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Twogymregistration;
