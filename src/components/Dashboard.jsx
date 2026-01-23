import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingBag,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Plus,
  List,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
// import axios from "axios";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user?.role === "viewer") {
      navigate("/orders");
    }
  }, [user, navigate]);

  // const [notificationCount, setNotificationCount] = useState(0);

  // const fetchNotifications = async () => {
  //   try {
  //     const res = await axios.get(
  //       "http://localhost:5000/api/orders/notification-count",
  //     );
  //     if (res.data.success) {
  //       setNotificationCount(res.data.count);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   fetchNotifications();

  //   const interval = setInterval(() => {
  //     fetchNotifications();
  //   }, 5000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-linear-to-b from-orange-600 to-red-700 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-orange-500">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="/logo.png"
                  alt="Spice Drama"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-bold text-lg">Spice Drama</h1>
                <p className="text-xs text-orange-200">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-orange-500 rounded-lg"
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {["admin", "editor"].includes(user?.role) && (
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
            >
              <Plus className="w-5 h-5 mr-3" />
              {sidebarOpen && "Add Items"}
            </NavLink>
          )}

          {["admin", "editor"].includes(user?.role) && (
            <NavLink
              to="/list"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
            >
              <List className="w-5 h-5 mr-3" />
              {sidebarOpen && "List Items"}
            </NavLink>
          )}

          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `flex items-center p-3 rounded-lg transition ${
                isActive
                  ? "bg-white text-orange-600 shadow"
                  : "hover:bg-orange-500"
              }`
            }
          >
            <ShoppingBag className="w-5 h-5 mr-3" />
            {sidebarOpen && "Orders"}
          </NavLink>
          {/* User Management - Admin Only */}
          {user?.role === "admin" && (
            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg transition ${
                  isActive
                    ? "bg-white text-orange-600 shadow"
                    : "hover:bg-orange-500"
                }`
              }
            >
              <Users className="w-5 h-5 mr-3" />
              {sidebarOpen && "Manage Users"}
            </NavLink>
          )}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-orange-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 hover:bg-orange-500 rounded-lg cursor-pointer"
          >
            <LogOut className="w-5 h-5 mr-2" />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="bg-white shadow border-b">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="relative w-1/2"></div>

            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              {/* <button className="relative hover:text-orange-600 transition">
                <Bell />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-semibold">
                    {notificationCount}
                  </span>
                )}
              </button> */}

              {/* User Profile - Shows logged in user */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold">
                  <img src="profile.png" className="h-7 w-7" alt="" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-800">
                    {user?.username || "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Pages Render Here */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
