import React from "react";
import { useNavigate } from "react-router-dom";
import DashNavigation from "../DashNavigation/dashnavigation";

function DashLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row bg-gradient-to-r from-[#F5F5F7] to-[#E0E7FF] min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5 bg-white shadow-md">
        <DashNavigation />
      </aside>

      {/* Main Content */}
      <main className="w-4/5 p-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Welcome to the Dashboard</h1>
          <p className="text-gray-600 mt-2">Your management hub for gym registrations.</p>
        </header>

        {/* Card Container */}
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Your Gyms</h2>
            <p className="text-gray-600 mb-6">
              Stay on top of your gym registrations and keep track of your members.
            </p>
            <button
              onClick={() => navigate("/GymRegistrationList")}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            >
              View Applied Gyms
            </button>
            <p className="text-sm text-gray-500 mt-4">
              "Empower your fitness journey."
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashLandingPage;
