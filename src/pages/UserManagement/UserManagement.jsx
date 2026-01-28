import React, { useState, useEffect } from "react";
import adminApi from "../../services/adminApi";
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

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/auth/users");
      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
      showMessage("error", "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- CREATE USER ---------------- */
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminApi.post("/auth/users", newUser);
      setNewUser({ username: "", email: "", password: "", role: "viewer" });
      setShowForm(false);
      fetchUsers();
      showMessage("success", "User created successfully!");
    } catch {
      showMessage("error", "Failed to create user");
    }
  };

  /* ---------------- DELETE USER ---------------- */
  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      await adminApi.delete(`/auth/users/${id}`);
      fetchUsers();
      showMessage("success", "User deleted successfully!");
    } catch {
      showMessage("error", "Failed to delete user");
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 4000);
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return <Shield size={16} />;
    if (role === "editor") return <Edit size={16} />;
    return <Eye size={16} />;
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-5 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600">
          Manage admin panel users and permissions
        </p>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.type === "success" ? <Check /> : <AlertCircle />}
          {message.text}
        </div>
      )}

      {/* ADD USER BUTTON */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        {showForm ? <X /> : <UserPlus />}
        {showForm ? "Cancel" : "Add New User"}
      </button>

      {/* ADD USER FORM */}
      {showForm && (
        <form
          onSubmit={handleCreateUser}
          className="bg-white p-4 rounded-lg shadow space-y-3 max-w-md"
        >
          <input
            placeholder="Username"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            className="w-full border px-3 py-2 rounded"
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>

          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Create User
          </button>
        </form>
      )}

      {/* USERS TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="p-4">No users found</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Username</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2 flex items-center gap-2 capitalize">
                    {getRoleIcon(u.role)} {u.role}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
