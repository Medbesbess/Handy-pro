import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Search, LogOut, User, Sun, Moon, Settings } from "lucide-react";
import axios from "axios";
import NotificationBell from "./NotificationBell";

const Navbar = () => {
  const [isDark, setIsDark] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [adminData, setAdminData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  useEffect(() => {
    setShowProfileMenu(false);
  }, [location]);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:3001/users/admin/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.user) {
        setAdminData(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (showProfileMenu && !e.target.closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, [showProfileMenu]);

  return (
    <nav className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold">A</span>
          </div>
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
            Admin Panel
          </span>
        </Link>
      </div>

      <div className="hidden md:flex flex-1 max-w-xl mx-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
          />
          <Search
            className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
            size={20}
          />
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowSearchBar(!showSearchBar)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
        >
          <Search className="text-gray-600 dark:text-gray-400" size={20} />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="text-gray-600 dark:text-gray-400" size={20} />
          ) : (
            <Moon className="text-gray-600 dark:text-gray-400" size={20} />
          )}
        </button>

        <button
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 relative"
          aria-label="Notifications"
        >
          <Bell className="text-gray-600 dark:text-gray-400" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-800"></span>
        </button>

        <div className="relative profile-menu">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-lg overflow-hidden border-2 border-white dark:border-gray-700">
              {adminData?.photoUrl ? (
                <img
                  src={adminData.photoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="text-white" size={20} />
              )}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                {adminData?.username || "Admin User"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {adminData?.email || "admin@example.com"}
              </div>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 py-1 overflow-hidden">
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                onClick={() => setShowProfileMenu(false)}
              >
                <Settings
                  size={16}
                  className="mr-2 text-gray-500 dark:text-gray-400"
                />
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showSearchBar && (
        <div className="absolute top-16 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-200 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
            />
            <Search
              className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500"
              size={20}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
