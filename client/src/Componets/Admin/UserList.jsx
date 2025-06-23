import React, { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import useStore from "../../hooks/useStore";

const UserList = () => {
  const [role, setRole] = useState("store");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [updating, setUpdating] = useState({});

  const { users, loading, error, fetchUsersByRole, changeUserRole } = useStore();

  useEffect(() => {
    fetchUsersByRole(role);
  }, [role]);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating((prev) => ({ ...prev, [userId]: true }));
    await changeUserRole(userId, newRole);
    setUpdating((prev) => ({ ...prev, [userId]: false }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        User Management
      </h1>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 w-full md:max-w-md">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            className="w-full outline-none text-sm text-gray-700"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="store">Store</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading && <div className="text-center text-gray-600">Loading users...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
          <table className="min-w-full bg-white text-center">
            <thead className="bg-gray-100 text-sm font-semibold text-gray-700">
              <tr>
                <th className="px-4 py-3 border-b">Username</th>
                <th className="px-4 py-3 border-b">Email</th>
                <th className="px-4 py-3 border-b">Phone</th>
                <th className="px-4 py-3 border-b">Referral Code</th>
                {role !== "admin" && <th className="px-4 py-3 border-b">Coupons</th>}
                {role !== "admin" && <th className="px-4 py-3 border-b">Redeemed Coupons</th>}
                {role !== "admin" && <th className="px-4 py-3 border-b">Used Coupons</th>}
                {role === "store" && <th className="px-4 py-3 border-b">Store</th>}
                <th className="px-4 py-3 border-b">Role</th>
                <th className="px-4 py-3 border-b">Change Role</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-4 py-3 border-b text-sm text-gray-800">{user.username}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-800">{user.email}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-800">{user.phone}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-800">{user.myReferralCode}</td>

                    {role !== "admin" && (
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {Array.isArray(user.coupons) ? user.coupons.length : 0}
                      </td>
                    )}
                    {role !== "admin" && (
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {Array.isArray(user.redeemedCoupons)
                          ? user.redeemedCoupons.length
                          : 0}
                      </td>
                    )}
                    {role !== "admin" && (
                      <td className="px-4 py-3 border-b text-sm text-gray-800">
                        {user.usedCouponsCount || 0}
                      </td>
                    )}

                    {role === "store" && (
                      <td className="px-4 py-3 border-b text-sm">
                        {user.storeId ? (
                          <Link
                            to={`/storedetail/${user.storeId}`}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {user.storeName || "View Store"}
                          </Link>
                        ) : (
                          <span className="text-gray-400 italic">No store linked</span>
                        )}
                      </td>
                    )}

                    <td className="px-4 py-3 border-b text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-blue-100 text-blue-600"
                            : user.role === "store"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 border-b text-sm">
                      <select
                        className="border border-gray-300 rounded-md px-2 py-1 text-sm text-gray-700"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={updating[user._id]}
                      >
                        <option value="admin">Admin</option>
                        <option value="store">Store</option>
                        <option value="user">User</option>
                      </select>
                      {updating[user._id] && (
                        <span className="ml-2 text-xs text-gray-500">Updating...</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-6 text-center text-sm text-gray-500">
                    {searchTerm
                      ? "No users match your search criteria."
                      : "No users found for the selected role."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserList;
