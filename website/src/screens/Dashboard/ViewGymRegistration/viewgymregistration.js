import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DashNavigation from "../DashNavigation/dashnavigation";
import info from "../../../assets/iconamoon_information-circle-fill.svg";
import timee from "../../../assets/mdi_weather-date.svg";

const ViewGymRegistration = () => {
  const { id } = useParams();
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/gymregistration/registrations/${id}`
        );
        setRegistration(response.data);
      } catch (error) {
        setError("Failed to load registration.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistration();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/gymregistration/registrations/${id}/status_reg`,
        { status }
      );

      //data email status sent to email
      const emailData = {
        to: registration.email, //regstered email
        subject: status === 1 ? "Gym Registration Approved" : "Gym Registration Rejected",
        html: status === 1 
          ? `<p>Congratulations, ${registration.fname} ${registration.lname}!</p>
             <p>Your gym registration has been approved. Please <a href="http://localhost:3000/GymOwnerAccountRegistration">click here</a> to complete your Gym Owner Account Registration.</p>`
          : `<p>Dear ${registration.fname} ${registration.lname},</p>
             <p>We regret to inform you that your gym registration has been declined. If you have any questions, feel free to contact us.</p>`
      };

      //api send email
      await axios.post('http://localhost:5000/api/send-email', emailData);

      alert(`Status updated to ${status === 1 ? "APPROVED" : "REJECTED"}.`);
      const response = await axios.get(
        `http://localhost:5000/api/gymregistration/registrations/${id}`
      );
      setRegistration(response.data);
    } catch (error) {
      alert("Failed to update status or send email.");
    }
  };

  const renderStatusText = (status) => {
    switch (status) {
      case 1:
        return "Approved";
      case 2:
        return "Rejected";
      default:
        return "Pending";
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!registration) return <p className="text-center">No registration found</p>;

  return (
    <div className="flex flex-row min-h-screen bg-gray-100">
      <aside className="w-1/5 bg-gray-200">
        <DashNavigation />
      </aside>
      <main className="flex-grow p-5">
        <div className="bg-white rounded-lg shadow-md p-5">
          
          <button
            className="mb-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
            onClick={() => navigate("/GymRegistrationList")} //back buttton to list
          >
            Back to Registrations
          </button>

          <div className="flex items-center mb-4">
            <img src={info} alt="Info" className="w-6 h-6 mr-2" />
            <h2 className="text-2xl font-semibold">Application Details</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 border rounded-lg bg-white shadow-sm">
              <h3 className="text-xl font-semibold">{registration.gymname}</h3>
              <p className="text-lg">
                {registration.fname} {registration.lname}
              </p>
              <p className="text-gray-600 italic">Owner</p>
              <p className="text-lg">{registration.email}</p>
              <p className="text-gray-600 italic">Email Address</p>
              <p>
                Status: <strong>{renderStatusText(registration.status_reg)}</strong>
              </p>
              {registration.status_reg === 0 && (
                <div className="mt-4">
                  <button
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded hover:bg-green-600 mr-2"
                    onClick={() => handleStatusUpdate(1)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded hover:bg-red-600"
                    onClick={() => handleStatusUpdate(2)}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <img src={timee} alt="Established" className="w-6 h-6 mr-2" />
                  <h4 className="font-semibold">Date Established</h4>
                </div>
                <p>{registration.dateEstablished}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                <div className="flex items-center">
                  <img src={timee} alt="Submission" className="w-6 h-6 mr-2" />
                  <h4 className="font-semibold">Submission Date</h4>
                </div>
                <p>{registration.submission_time}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ViewGymRegistration;
