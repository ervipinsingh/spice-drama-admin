import React, { useState, useEffect } from "react";
import { authAPI } from "../../services/api";
import {
  UserPlus,
  Trash2,
  Shield,
  Eye,
  Edit,
  X,
  Check,
  AlertCircle,
} from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.getAllUsers();
      setUsers(response.data.users || []);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await authAPI.createUser(newUser);
      setNewUser({ username: "", email: "", password: "", role: "viewer" });
      setShowForm(false);
      fetchUsers();
      showMessage("success", "User created successfully!");
    } catch {
      showMessage("error", "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return;
    try {
      await authAPI.deleteUser(userId);
      fetchUsers();
      showMessage("success", "User deleted successfully!");
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 5000);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 border-red-200";
      case "editor":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return <Shield className="w-4 h-4" />;
    if (role === "editor") return <Edit className="w-4 h-4" />;
    return <Eye className="w-4 h-4" />;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 space-y-6">
      {/* Header  */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">
          Manage admin panel users and permissions
        </p>
      </div>

      {/* Message  */}
      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? <Check /> : <AlertCircle />}
            {message.text}
          </div>
          <X
            className="cursor-pointer"
            onClick={() => setMessage({ type: "", text: "" })}
          />
        </div>
      )}

      {/* Add User Button  */}
      <button
        onClick={() => setShowForm(!showForm)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition w-fit ${
          showForm
            ? "bg-gray-200 text-gray-700"
            : "bg-orange-500 text-white hover:bg-orange-600"
        }`}
      >
        {showForm ? <X /> : <UserPlus />}
        {showForm ? "Cancel" : "Add New User"}
      </button>

      {/* Add User Form  */}
      {showForm && (
        <div className="bg-white border rounded-lg shadow p-6">
          <form
            onSubmit={handleCreateUser}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              className="border px-4 py-2 rounded-lg"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border px-4 py-2 rounded-lg"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
            <button
              type="submit"
              className="md:col-span-2 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600"
            >
              Create User
            </button>
          </form>
        </div>
      )}

      {/* Mobile View  */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-xl p-4 shadow-sm"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${getRoleBadgeColor(
                  user.role,
                )}`}
              >
                {getRoleIcon(user.role)}
                <span className="capitalize">{user.role}</span>
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm border ${
                  user.isActive
                    ? "bg-green-100 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-200"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </span>
              <button
                onClick={() => handleDeleteUser(user._id, user.username)}
                className="text-red-600 flex items-center gap-1"
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table  */}
      <div className="hidden md:block bg-white rounded shadow-lg border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-200 rounded">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">User</th>
                <th className="px-6 py-4 text-left font-semibold">Role</th>
                <th className="px-6 py-4 text-left font-semibold">Status</th>
                <th className="px-6 py-4 text-left font-semibold">Created</th>
                <th className="px-6 py-4 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-orange-50/40 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-sm ${getRoleBadgeColor(
                        user.role,
                      )}`}
                    >
                      {getRoleIcon(user.role)}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
                        user.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          user.isActive ? "bg-green-600" : "bg-gray-400"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() =>
                          handleDeleteUser(user._id, user.username)
                        }
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
