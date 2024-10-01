import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DashNavigation from "../../DashNavigation/dashnavigation";

const GymRegistrationList = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("submission_time"); // Default sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/gymregistration/registrations"
        );
        setRegistrations(response.data);
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setError("Failed to load registrations.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Filter registrations based on search query
  const filteredRegistrations = registrations.filter((reg) =>
    Object.values(reg).some(
      (val) =>
        typeof val === "string" &&
        val.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort registrations based on selected field and order
  const sortedRegistrations = filteredRegistrations.slice().sort((a, b) => {
    const aValue =
      typeof a[sortField] === "string" ? new Date(a[sortField]) : a[sortField];
    const bValue =
      typeof b[sortField] === "string" ? new Date(b[sortField]) : b[sortField];

    if (sortOrder === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const handleSortChange = (field) => {
    setSortField(field);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleView = (id) => {
    navigate(`/ViewGymRegistration/${id}`);
  };

  return (
    <>
      <div className=" flex flex-row bg-[#F5F5F7]">
        <div className="w-[15%] ">
          <DashNavigation />
        </div>
        <div className="container mx-auto mt-5 w-full">
          <div className="w-full bg-slate-100">
            <div className="p-5 text-lg font-semibold text-gray-900 dark:text-white dark:bg-gray-800">
              Gym Registrations
              <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                View and manage gym registration applications.
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-5">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Sort Options */}
          <div className="mt-5 mb-5">
            <label className="mr-2">Sort By:</label>
            <select
              value={sortField}
              onChange={(e) => handleSortChange(e.target.value)}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="submission_time">Submission Date</option>
              <option value="dateEstablished">Date Established</option>
              <option value="gymname">Gym Name</option>
            </select>
            <span className="ml-2">
              {sortOrder === "asc" ? "Ascending" : "Descending"}
            </span>
          </div>

          <table className="min-w-full bg-white mt-5">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Gym Name</th>
                <th className="py-3 px-6 text-left">Owner</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Date Established</th>
                <th className="py-3 px-6 text-left">Location</th>
                <th className="py-3 px-6 text-left">Gym Pictures</th>
                <th className="py-3 px-6 text-left">Business Permit</th>
                <th className="py-3 px-6 text-left">Submission Time</th>
                <th className="py-3 px-6 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {sortedRegistrations.length > 0 ? (
                sortedRegistrations.map((reg, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">{reg.gymname}</td>
                    <td className="py-3 px-6 text-left">
                      {`${reg.fname} ${reg.mname} ${reg.lname}`}
                    </td>
                    <td className="py-3 px-6 text-left">{reg.email}</td>
                    <td className="py-3 px-6 text-left">
                      {reg.dateEstablished
                        ? new Date(reg.dateEstablished).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">{reg.location}</td>
                    <td className="py-3 px-6 text-left">
                      {reg.gymPics.length > 0
                        ? reg.gymPics.map((pic, idx) => (
                            <a
                              key={idx}
                              href={`http://localhost:5000/${pic}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Pic {idx + 1}
                            </a>
                          ))
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {reg.businessPermit ? (
                        <a
                          href={`http://localhost:5000/${reg.businessPermit}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Permit
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(reg.submission_time).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 text-left">
                      <button
                        onClick={() => handleView(reg.id)} // Navigate to the detailed view
                        className="text-blue-600 hover:text-blue-800"
                      >
                        VIEW
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    No matching records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GymRegistrationList;
