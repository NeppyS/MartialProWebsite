import React, { useState, useEffect } from "react";
import axios from "axios";
import DashNavigation from "./dashnavigation";

const Button = ({ onClick, isActive, children }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-semibold ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
      }`}
    >
      {children}
    </button>
  );
};

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [sortOrder, setSortOrder] = useState("id");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/gymregistration/UsersPage?role=${role}&orderBy=${sortOrder}`
        );
        setUsers(response.data);
      } catch (error) {
        setError("There was an error fetching the users!");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role, sortOrder]);

  return (
    <div className="flex flex-row bg-[#F5F5F7] min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/5">
        <DashNavigation />
      </aside>

      {/* Main Content */}
      <main className="w-4/5 p-5">
        <h1 className="text-3xl font-bold mb-4">User Management</h1>

        {loading && <p className="text-center">Loading users...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex flex-col bg-violet-300 p-5 rounded-md shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Users</h2>

          {/* Role Filter Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button onClick={() => setRole("")} isActive={role === ""}>All Users</Button>
            <Button onClick={() => setRole("member")} isActive={role === "member"}>Members</Button>
            <Button onClick={() => setRole("coach")} isActive={role === "coach"}>Coaches</Button>
            <Button onClick={() => setRole("owner")} isActive={role === "owner"}>Owners</Button>
          </div>

          {/* Sort Buttons */}
          <div className="flex space-x-4 mb-6">
            <Button onClick={() => setSortOrder("id")} isActive={sortOrder === "id"}>Sort by ID</Button>
            <Button onClick={() => setSortOrder("name")} isActive={sortOrder === "name"}>Sort by Name</Button>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto bg-white rounded-md shadow-lg">
            <table className="w-full border border-gray-200 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gym Enrolled</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.gymenrolled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UsersPage;
