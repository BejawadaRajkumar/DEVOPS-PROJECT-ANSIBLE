import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ...existing imports...

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
     const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/admin/users`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUsers(data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  // Delete user function
  const deleteUser = async (id) => {
    if (!window.confirm(`Are you sure you want to delete user with ID ${id}?`)) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_URL}/api/admin/users/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== id));
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      alert("Error deleting user.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen bg-[#191414] text-[#1DB954] text-xl animate-pulse">
        Loading users...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-[#FFFFFF] p-6 md:p-12 font-sans antialiased">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-[#1DB954] pb-4">
        <h1 className="text-4xl font-extrabold text-[#1DB954] tracking-tight">
          Admin Portal 🎵
        </h1>
        <button
          onClick={handleLogout}
          className="mt-4 md:mt-0 px-6 py-2 bg-[#1DB954] text-black font-semibold rounded-full shadow-lg hover:bg-[#191414] hover:text-[#1DB954] transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-8 border-b border-[#282828] mb-8">
        <button
          className={`pb-2 text-lg font-semibold ${
            activeTab === "overview"
              ? "text-[#1DB954] border-b-2 border-[#1DB954]"
              : "text-[#B3B3B3]"
          }`}
          onClick={() => setActiveTab("overview")}
        >
          User Management
        </button>
        <button
          className={`pb-2 text-lg font-semibold ${
            activeTab === "songs"
              ? "text-[#1DB954] border-b-2 border-[#1DB954]"
              : "text-[#B3B3B3]"
          }`}
          onClick={() => setActiveTab("songs")}
        >
          Songs Management
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="bg-[#212121] rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">User Management</h2>
          {users.length === 0 ? (
            <p className="text-[#B3B3B3] text-center py-10">
              No users found. It's quiet in here... 😴
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left table-auto border-separate border-spacing-y-2">
                <thead className="text-xs uppercase text-[#B3B3B3] bg-[#191414]">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="bg-[#181818] rounded-lg shadow-sm hover:bg-[#282828] transition duration-300 ease-in-out"
                    >
                      <td className="px-4 py-4 rounded-l-lg font-mono text-sm">{user.id}</td>
                      <td className="px-4 py-4 font-medium text-[#FFFFFF]">
                        {user.email || "—"}
                      </td>
                      <td className="px-4 py-4 rounded-r-lg text-right">
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="px-4 py-2 bg-[#1DB954] text-black rounded-md font-semibold hover:bg-[#191414] hover:text-[#1DB954] transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "songs" && (
  <div className="bg-[#212121] rounded-2xl p-6 shadow-2xl">
    <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">Songs Management</h2>
    {/* Search Bar */}
    <div className="flex justify-center mb-8">
      <input
        type="text"
        placeholder="Search a song"
        className="w-1/2 px-4 py-2 rounded-lg bg-[#181818] text-[#FFFFFF] border border-[#282828] focus:outline-none focus:border-[#1DB954]"
      />
    </div>
    {/* Empty tab content */}
  </div>
)}
    </div>
  );
};

export default AdminDashboard;